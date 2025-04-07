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
    id: string;
    username: string;
    email: string;
    matricule: string;
    first_name: string;
    last_name: string;
    photo_url: string;
}

type AnnouncementsData = {
    items: Items[];
}

export type { Items, Author, AnnouncementsData };