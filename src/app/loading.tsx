import Image from 'next/image';
import styles from './page.module.css';

export default function Loading() {
	return (
		<main className={styles.not_found}>
			<Image src="./loading.svg" alt='loading' width={100} height={100} />
		</main>
	);
}