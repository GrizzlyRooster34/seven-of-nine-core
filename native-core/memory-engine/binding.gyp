{
  "targets": [{
    "target_name": "memory_engine",
    "sources": ["memory_search.cc"],
    "cflags_cc": ["-O3", "-std=c++17"],
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
    "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
  }]
}