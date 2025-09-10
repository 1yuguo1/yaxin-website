export interface NavProps {
    isFixed: boolean;
    isColored: boolean;
    icon_num: boolean;
    isLogin: boolean;
    name: string;
}

export interface NavEmits {
    search: () => void;
}

export interface MenuItem {
    icon: string;
    label: string;
    path: string;
}