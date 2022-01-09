import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import Figure from './components/games/figure/Figure';

export default function App() {
  return (
    <div className="app">
      <HashRouter>
        <Routes>
          <Route path="/">
            <Route index element={ <HomeScreen /> } />
            <Route path="figure" element={ <Figure /> } />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
