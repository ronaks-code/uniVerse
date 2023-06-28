import ContentContainer from "../../components/ContentContainer/ContentContainer";
import Header from "../../components/Header/Header";
import SideBar from "../../components/SideBar/Sidebar";
import { homeClasses } from "./homeClasses";

const Home = () => {
  const { container, cardContainer, title, description } = homeClasses;

  return (
    <>
      <div className='flex flex-col items-start content-start h-[100vh] ml-16'>
        <SideBar />
        <ContentContainer />
      </div>
    </>
  );
}

export default Home;