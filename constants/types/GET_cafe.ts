export type Cafe = {
    id: string;
    name: string;
    slug: string;
    previous_slugs: string[];
    features: any[];
    description: string;
    logo_url: string;
    banner_url: string;
    photo_urls: string[];
    affiliation: {
    university: string;
    faculty: string;
    };
    is_open: boolean;
    status_message: string;
    opening_hours: OpeningHours[];
    location: {
    pavillon: string;
    local: string;
    floor: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    };
    contact: {
    email: string;
    phone_number: string;
    website: string;
    };
    social_media: {
    facebook: string;
    instagram: string;
    x: string;
    };
    payment_details: any[];
    owner: {
    id: string;
    username: string;
    email: string;
    matricule: string;
    first_name: string;
    last_name: string;
    photo_url: string;
    },
    staff: {
    admins: any[];
    volunteers: any[];
    },
    menu: {
    layout: string;
    categories: Category[];
    }
}

export type Category = {
    id: string;
    name: string;
    description: string;
    items: Item[];
};

export type Item = {
    id: string;
    name: string;
    description: string;
    tags: string[];
    image_url: string;
    price: string;
    in_stock: boolean;
    options: Option[];
    interactions: Interaction[];
};

type Option = {
    type: string;
    value: string;
    fee: string;
};

type Interaction = {
    type: string;
    count: number;
    me: boolean;
};

type OpeningHours = {
    day : string;
    blocks : DayBlock[]
}

