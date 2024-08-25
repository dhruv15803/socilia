import { Oval } from "react-loader-spinner";

type Props = {
    width:string;
    height:string;
    color:string;
}

const Loader = ({width,height,color}:Props) => {
  return (
    <>
      <Oval
        visible={true}
        height={height}
        width={width}
        color={color}
        secondaryColor="white"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </>
  );
};

export default Loader;
