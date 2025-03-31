import { Cafe } from "./GET_cafe";

type Links = {
    first: string;
    last: string;
    self: string;
    next: string;
    prev: string;
};

export type allCafe = {
    items: Cafe[];
    total: number;
    page: number;
    size: number;
    pages: number;
    links: Links;
};
