import ContentContainer from "../../components/ContentContainer/ContentContainer";
import Header from "../../components/Header/Header";
import SideBar from "../../components/SideBar/Sidebar";
import { homeClasses } from "./homeClasses";

const Home = () => {
  const { container, cardContainer, title, description } = homeClasses;

  return (
    <>
      <SideBar />
      <ContentContainer />
      
    </>
  );
}

export default Home;