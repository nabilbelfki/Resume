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
  
  export interface Slide {
    name: string;
    image: {
      width: number;
      height: number;
      src: string;
      alt: string;
    }
  }