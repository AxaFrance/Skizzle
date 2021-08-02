type TabDragType = {
	id: string;
	width: number;
	left: number;
	isDrag: boolean;
	element: HTMLElement;
};

export type TabType = {
	order: number;
	label: string;
	icon?: any;
	selected?: boolean;
	disabled?: boolean;
	counter?: number;
	sortable?: boolean;
} & Partial<TabDragType>;
