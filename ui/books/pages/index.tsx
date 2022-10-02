import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useQuery, gql } from "@apollo/client";

const GET_BOOKS = gql`
  query ExampleQuery {
    books {
      id
      title
      aFieldThatWillBeOverridden
      updatedAt
    }
  }
`;

const Home: NextPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKS, {
    fetchPolicy: "cache-first", // Used for first execution

    nextFetchPolicy: "cache-first", // Used for subsequent executions
  });
  console.log(error);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :</p>;

  return (
    <div className="">
      <Head>
        <title>Books UI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome</h1>

        <button onClick={() => refetch()}>Refetch books!</button>
        {data?.books.map((item, index) => (
          <div key={item.id}>
            <p>{item.id}</p>
            <p>{item.title}</p>
            <p>{item.updatedAt}</p>
            <p>{item.aFieldThatWillBeOverridden}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
