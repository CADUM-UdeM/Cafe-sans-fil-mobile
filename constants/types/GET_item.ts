interface Option {
    type: string;
    value: string;
    fee: string;
}

/** Interface for a item on the menu 
 * https://cafesansfil-api-r0kj.onrender.com/docs#/items/get_item_api_cafes__slug__menu_items__id__get
*/
export type Item = {
    id: string;
    cafe_id: string;
    category_ids: string[];
    name: string;
    description: string;
    tags: string[];
    image_url: string;
    price: string;
    in_stock: boolean;
    options: Option[];
}
