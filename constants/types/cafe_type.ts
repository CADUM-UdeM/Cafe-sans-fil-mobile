/**
 * Definition de l'interface pour les objets café
 */

type DayBlock = {
    start: string;
    end: string;
};

type Hours = {
    day: string;
    blocks: DayBlock[];
};

type CafeLocation = {
    pavillon: string;
    local: string;
};

type Contact = {
    email: string;
    phone_number: string | null;
    website?: string | null;
};

type SocialMedia = {
    platform_name: string;
    link: string;
};

type PaymentMethods = {
    method: string;
    minimum: string;
};

type AdditionalInfo = {
    type: string;
    value: string;
    start: string;
    end: string | null;
};

type Staff = {
    username: string;
    role: string;
};

type Options = {
    type: string;
    value: string;
    fee: string;
};

type MenuItems = {
    item_id: string;
    name: string;
    slug: string;
    tags: string[];
    description: string;
    image_url: string;
    price: string;
    in_stock: boolean;
    category: string;
    options: Options[];
};

interface Cafe {
    cafe_id: string;
    name: string;
    slug: string;
    previous_slugs: string[];
    features: string[];
    description: string;
    image_url: string;
    faculty: string;
    is_open: boolean;
    status_message: string | null;
    opening_hours: Hours[];
    location: CafeLocation;
    contact: Contact;
    social_media: SocialMedia[];
    payment_methods: PaymentMethods[];
    additional_info: AdditionalInfo[];
    staff: Staff[];
    menu_items: MenuItems[];
    affiliation : {
        university : string;
        faculty : string;
    }
};