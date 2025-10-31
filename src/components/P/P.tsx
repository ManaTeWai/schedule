import { PProps } from "./P.props";
import styles from "./P.module.css";
import cn from "classnames";

import type { JSX } from "react";

export const P = ({ size = "medium", children, className, html, ...props }: PProps): JSX.Element => {
	const classNames = cn(styles.p, className, {
		[styles.small]: size == "small",
		[styles.medium]: size == "medium",
		[styles.large]: size == "large",
	});

	// Если передан html — вставляем его через dangerouslySetInnerHTML
	if (html) {
		return <p className={classNames} dangerouslySetInnerHTML={{ __html: html }} {...props} />;
	}

	return (
		<p className={classNames} {...props}>
			{children}
		</p>
	);
};
