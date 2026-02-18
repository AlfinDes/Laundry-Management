import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './CustomerLayout.css';

export default function CustomerLayout() {
    return (
        <div className="customer-layout">
            <Navbar />
            <main className="customer-main">
                <Outlet />
            </main>
        </div>
    );
}
