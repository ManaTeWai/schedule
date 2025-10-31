import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>{
	/** Традиционные дочерние элементы (строка или ReactNode). Не обязателен если используется `html`. */
	children?: ReactNode;
	/** Если указан — контент вставляется как HTML (dangerouslySetInnerHTML). */
	html?: string;
	size?: 'small' | 'medium' | 'large';
}
