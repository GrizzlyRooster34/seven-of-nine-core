
import React from 'react';


const URL_REGEX = /(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[[0-9a-fA-F:]+\]|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?::[0-9]+)?(?:\/[^\s]*)?/gi;


const LOCALHOST_REGEX = /(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::[0-9]+)?(?:\/[^\s]*)?/gi;

export interface DetectedLink {
  url: string;
  fullUrl: string; 
  isLocalhost: boolean;
  startIndex: number;
  endIndex: number;
}


export function detectLinks(text: string): DetectedLink[] {
  const links: DetectedLink[] = [];
  const seenUrls = new Set<string>();
  
  
  URL_REGEX.lastIndex = 0;
  
  let match;
  while ((match = URL_REGEX.exec(text)) !== null) {
    const url = match[0];
    
    
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    
    
    let fullUrl = url;
    if (!url.match(/^https?:\/\//)) {
      
      const isLocalhost = LOCALHOST_REGEX.test(url);
      fullUrl = `${isLocalhost ? 'http' : 'https'}://${url}`;
    }
    
    
    try {
      new URL(fullUrl);
    } catch {
      
      continue;
    }
    
    links.push({
      url,
      fullUrl,
      isLocalhost: LOCALHOST_REGEX.test(url),
      startIndex: match.index,
      endIndex: match.index + url.length
    });
  }
  
  return links;
}


export function hasLinks(text: string): boolean {
  URL_REGEX.lastIndex = 0;
  return URL_REGEX.test(text);
}


export function getFirstLink(text: string): DetectedLink | null {
  const links = detectLinks(text);
  return links.length > 0 ? links[0] : null;
}


export function makeLinksClickable(
  text: string,
  onLinkClick: (url: string) => void
): React.ReactNode[] {
  const links = detectLinks(text);
  
  if (links.length === 0) {
    return [text];
  }
  
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  
  links.forEach((link, index) => {
    
    if (link.startIndex > lastIndex) {
      elements.push(text.substring(lastIndex, link.startIndex));
    }
    
    
    elements.push(
      <a
        key={`link-${index}`}
        href={link.fullUrl}
        onClick={(e) => {
          e.preventDefault();
          onLinkClick(link.fullUrl);
        }}
        className="text-primary underline hover:text-primary/80 cursor-pointer"
        title={link.fullUrl}
      >
        {link.url}
      </a>
    );
    
    lastIndex = link.endIndex;
  });
  
  
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  
  return elements;
} 
