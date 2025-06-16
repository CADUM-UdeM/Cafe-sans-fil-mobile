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
    id: string;
    username: string;
    email: string;
    matricule: string;
    first_name: string;
    last_name: string;
    photo_url: string;
}
<<<<<<< HEAD

=======
>>>>>>> 1acb5f19a4bd78ebc95dd213f0967f88c2eb0f07
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 1acb5f19a4bd78ebc95dd213f0967f88c2eb0f07
