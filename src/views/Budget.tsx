import { useMount } from "react-use";

const Budget = () => {
  useMount(() => {
    console.log("Budget");
  });

  return <div>Budget</div>;
};

export default Budget;
