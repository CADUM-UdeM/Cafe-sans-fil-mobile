interface Favoris {
    cafe_id: string ;
    name: string;
    slug: string;
    image_url: string;
    faculty: string;
    is_open: boolean;
    status_message: string | null;
    location: CafeLocation;
};