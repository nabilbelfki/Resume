// /path/to/shared/types.ts
interface Image {
  name: string;
  url: string;
  backgroundColor: string;
  height: number;
  width: number;
}

interface Description {
  color: string;
  text: string;
  backgroundColor: string;
}

export interface Skill {
  name: string;
  type: string;
  image: Image;
  description: Description;
}

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

  export interface Thumbnail {
    path: string;
    fileName: string;
    width: number;
    height: number;
    backgroundColor: string;
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
      backgroundColor: string;
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
    thumbnail: Thumbnail;
    languages: Language[];
    repository: Repository;
    container: Container;
    tools: Tool[];
    client: Client;
  }

  export interface comment {
    date: string;
    time: string;
    author: {
      firstName: string;
      lastName: string;
    }
    text: string;
  }

  export interface Breadcrumb {
    label: string;
    href: string;
  }

  export interface Action {
    label: string;
    action: (ids: string[]) => void
  }

  export type MediaType = 'Image' | 'Video' | 'Sound' | null;

  export interface Media {
      _id?: string; // Optional for MongoDB documents
      name: string;
      path: string; // URL or path to the media file
      description: string;
      size?: number; // File size in bytes
      type: MediaType;
      backgroundColor?: string;
      file?: File | Blob; // For new uploads before they're saved to server
      extension?: string; // File extension (e.g., 'jpg', 'mp4')
      dimensions?: { // For images/videos
          width?: number;
          height?: number;
      };
      url?: string; // Full URL to access the media
      createdAt?: Date; // Timestamp
      updatedAt?: Date; // Timestamp
  }

  export interface Cell {
      text: {
          value: string;
          family: string;
          size: number;
          weight: number;
          color: string;
          textAlign: 'left' | 'center' | 'right';
      },
      color: string;
      padding: number;
      border: {
          type: 'solid' | 'dashed';
          dash?: number;
          color: string;
          sides: {
              top: boolean;
              left: boolean;
              right: boolean;
              bottom: boolean;
          }
          thickness: number;
          radius: {
              topLeft: number;
              topRight: number;
              bottomLeft: number;
              bottomRight: number;
          }
      }
  }

  export interface Record {
      cells: Cell[];
  }


  export interface ListItem {
    marginLeft: number;
    text: string;
  }

  export interface Checkbox {
    checked: boolean;
    text: string;
  }

  export interface Element {
    id?: number;
    tag: string;
    text?: string;
    textAlign?: 'left' | 'center' | 'right' | 'undefined';
    items?: ListItem[] | Checkbox[];
    source?: string;
    extension?: string;
    color?: string;
    type?: 'solid' | 'dashed';
    thickness?: number;
    dashLength?: number;
    records?: Record;
  }

  export interface EditorHandle {
    getContent: () => Element[];
    setBlocks: (blocks: Block[]) => void;
  }

  export type Block = {
    id: number;
    type: string;
    content: string;
    textAlign?: 'left' | 'center' | 'right';
};