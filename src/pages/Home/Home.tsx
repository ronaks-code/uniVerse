import ContentContainer from "../../components/ContentContainer/ContentContainer";
import Header from "../../components/Header/Header";
import { homeClasses } from "./homeClasses";

const Home = () => {
  const { container, cardContainer, title, description } = homeClasses;

  return (
    <>
      <div className='flex flex-col items-start content-start h-[100vh]'>
        <ContentContainer />
      </div>
    </>
  );
}

export default Home;