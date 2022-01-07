import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import Figure from './components/games/figure/Figure';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={ <HomeScreen /> } />
            <Route path="figure" element={ <Figure /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
