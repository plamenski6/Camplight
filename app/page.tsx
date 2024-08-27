import styles from "@/styles/page.module.scss";
import { Result } from "@/types";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import ThemeProvider from "./theme-provider";

export default async function Home() {
  const response = await fetch("https://dummyjson.com/users?limit=10&skip=0");
  const result: Result = await response.json();
  let users = result.users;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5 pb-5">
      <h1 className={`${styles.heading} my-5`}>Camplight Project</h1>

      <ThemeProvider>
        <div className={styles.provider}>
          <Table users={users} />
          <Pagination total={result.total} />
        </div>
      </ThemeProvider>
    </div>
  );
}
