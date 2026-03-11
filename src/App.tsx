import { AppRouter } from "./app/router";
import { useSpatialNavigation } from "./hooks/useSpatialNavigation";

function App() {

  useSpatialNavigation();

  return <AppRouter />;
}

export default App;
