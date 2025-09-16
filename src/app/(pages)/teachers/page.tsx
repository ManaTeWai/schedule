import { Htag, Select_comp } from "@/components";
import styles from "@/app/page.module.css";


export default function Groups() {
	return (
		<main className={styles.main}>
            <Select_comp />
			<Htag tag="h2">ПРЕПОДАВАТЕЛЯМ</Htag>
		</main>
	);
}
