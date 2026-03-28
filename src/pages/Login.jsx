import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Static Blurs for soft aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#F8E9E7] rounded-full blur-[100px] opacity-70 z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#F3E1DF] rounded-full blur-[120px] opacity-60 z-0 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md border border-white rounded-[2rem] shadow-[0_15px_40px_rgba(216,167,177,0.15)] max-w-md w-full p-10 relative z-10"
      >
        <h2 className="text-3xl font-serif text-center text-[#2C2C2C] mb-8 font-light tracking-wide">
          Yansy<span className="text-[#D8A7B1] italic">Nails</span> <span className="text-[#C5A572] text-xl block mt-2 tracking-[0.2em] uppercase font-medium">Panel</span>
        </h2>
        
        {error && (
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm shadow-sm font-light">
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#2C2C2C] mb-2 uppercase tracking-widest">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-[#2C2C2C] focus:bg-white focus:border-[#D8A7B1] focus:ring-1 focus:ring-[#D8A7B1] transition-all outline-none font-light"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2C2C2C] mb-2 uppercase tracking-widest">Contraseña</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-[#2C2C2C] focus:bg-white focus:border-[#D8A7B1] focus:ring-1 focus:ring-[#D8A7B1] transition-all outline-none font-light"
              required
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#2C2C2C] text-white font-medium py-3 rounded-xl shadow-md mt-4 transition hover:bg-[#3D3D3D]"
          >
            Acceder
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
