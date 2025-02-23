// /path/to/shared/types.ts
export interface Experiences {
    level: number;
    zIndex: number;
    name: string;
    location: string;
    type: string;
    logo: {
      opened: {
        name: string;
        width: number;
        height: number;
      },
      closed: {
        name: string;
        width: number;
        height: number;
      }
    },
    title: string;
    subtitle?: string;
    period: {
      title: string;
      start: string;
      end?: string;
    },
    color: {
      line: string;
      name: string;
      title: string;
      subtitle?: string;
      type: string;
      date: string;
      location: string;
      background: string;
      details: string;
      description: {
        text: string;
        background: string;
      }
    },
    description: string;
  }
  
  
  interface Container {
    type: string;
    url: string;
    shortUrl: string;
  }
  
  interface Repository {
    type: string;
    url: string;
    shortUrl: string;
  }
  
  interface Tool {
    name: string;
    color: string;
    imagePath: string;
    url: string;
    width: number;
  }
  
  interface Language {
    name: string;
    color: string;
    percentage: number;
  }
  
  export interface Slide {
    name: string;
    image: {
      width: number;
      height: number;
      src: string;
      alt: string;
    }
  }

  export interface Location {
    latitude: number;
    longitude: number;
  }

  export interface Client {
    title: {
      name: string;
      fontSize: number;
    }
    logo: {
      width: number;
      height: number;
      path: string;
      fileName: string;
    },
    location: {
      latitude: number;
      longitude: number;
    }
    description: string;
    slides: Slide[];
  }
  
  export interface Project {
    _id: string;
    name: string;
    slug: string;
    description: string;
    startDate: string;
    endDate: string;
    duration: string;
    views: number;
    url: string;
    languages: Language[];
    repository: Repository;
    container: Container;
    tools: Tool[];
  }