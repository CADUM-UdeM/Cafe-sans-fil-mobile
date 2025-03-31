import { fetchSecurely, saveSecurely } from "./storage";
import { Item } from '@/constants/types/GET_item';


export async function fetchPannier() {
    let pannier = await fetchSecurely('pannier');
    return await pannier;
}

export async function deleteFromCart(itemId : string, cart : Item[]){
    let newCart = await cart.filter((item) => item.id != itemId);
    await saveSecurely('pannier', newCart);
    return fetchSecurely('pannier');
}