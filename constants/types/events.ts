<<<<<<< HEAD
type Items = {
    id: string;
    cafe_id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    active_until: string;
    tags: string[];
    author: Author;
    interactions: any[];
}

type Author = {
=======
export interface Item {
    id: string;
    name: string;
    description: string;
    image_url: string;
    start_date: string;
    end_date: string;
    location: string;
    cafes: Cafe[];
    creator: Creator;
    interactions: Interaction[];
}

export interface Cafe {
    id: string;
    name: string;
    slug: string;
    logo_url: null | string;
    banner_url: string;
}

export interface Creator {
>>>>>>> 5b12df81964d22e242c43b99da2f06790b8651ee
    id: string;
    username: string;
    email: string;
    matricule: string;
    first_name: string;
    last_name: string;
    photo_url: string;
}

<<<<<<< HEAD
type EventsData = {
    items: Items[];
}

export type { Items, Author, EventsData };
=======
export interface Interaction {
    type: string;
    count: number;
    me: boolean;
}

export interface Links {
    first: string;
    last: string;
    self: string;
    next: string;
    prev: null | string;
}

export interface EventList {
    items: Item[];
    total: number;
    page: number;
    size: number;
    pages: number;
    links: Links;
}
>>>>>>> 5b12df81964d22e242c43b99da2f06790b8651ee
