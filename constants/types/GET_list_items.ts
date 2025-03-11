interface Link {
    first: string;
    last: string;
    self: string;
    next: string;
    prev: string;
}
/* Interface for a GET all items from a menu
https://cafesansfil-api-r0kj.onrender.com/docs#/items/list_items_api_cafes__slug__menu_items_get
*/
interface ItemList extends Item {
    items: Item[];
    total: number;
    page: number;
    size: number;
    pages: number;
    links: Link;
}
