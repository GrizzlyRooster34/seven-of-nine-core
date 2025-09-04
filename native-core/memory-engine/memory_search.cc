#include <napi.h>
#include <vector>
#include <string>
#include <algorithm>

using namespace Napi;

struct Row {
  int64_t id;
  int64_t ts;
  int32_t importance;
  std::string topic;
  std::string content;
};

Value Search(const CallbackInfo& info) {
  Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsArray() || !info[1].IsObject()) {
    TypeError::New(env, "Usage: search(rows:Array, query:Object)").ThrowAsJavaScriptException();
    return env.Null();
  }
  Array rows = info[0].As<Array>();
  Object q = info[1].As<Object>();

  std::string topicFilter = q.Has("topic") ? std::string(q.Get("topic").As<String>()) : "";
  int importanceMin = q.Has("importance_min") ? q.Get("importance_min").As<Number>().Int32Value() : 1;
  int limit = q.Has("limit") ? q.Get("limit").As<Number>().Int32Value() : 50;

  std::vector<Row> buff; buff.reserve(rows.Length());
  for (uint32_t i=0; i<rows.Length(); i++) {
    if (!rows.Get(i).IsObject()) continue;
    Object r = rows.Get(i).As<Object>();
    Row row;
    row.id = r.Get("id").As<Number>().Int64Value();
    row.ts = r.Get("ts").As<Number>().Int64Value();
    row.importance = r.Get("importance").As<Number>().Int32Value();
    row.topic = r.Get("topic").As<String>().Utf8Value();
    row.content = r.Get("content").As<String>().Utf8Value();
    if (!topicFilter.empty() && row.topic != topicFilter) continue;
    if (row.importance < importanceMin) continue;
    buff.push_back(std::move(row));
  }

  // score = importance*100000 + ts (favor importance, then recency)
  std::sort(buff.begin(), buff.end(), [](const Row& a, const Row& b){
    long long sa = (long long)a.importance * 100000LL + a.ts;
    long long sb = (long long)b.importance * 100000LL + b.ts;
    return sa > sb;
  });

  Array out = Array::New(env);
  int count = std::min((int)buff.size(), limit);
  for (int i=0; i<count; i++) {
    Object o = Object::New(env);
    o.Set("id", Number::New(env, (double)buff[i].id));
    o.Set("ts", Number::New(env, (double)buff[i].ts));
    o.Set("importance", Number::New(env, buff[i].importance));
    o.Set("topic", String::New(env, buff[i].topic));
    o.Set("content", String::New(env, buff[i].content));
    out.Set(i, o);
  }
  return out;
}

Object Init(Env env, Object exports) {
  exports.Set("search", Function::New(env, Search));
  return exports;
}
NODE_API_MODULE(memory_engine, Init)