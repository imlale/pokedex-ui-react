import {useState, useEffect} from 'react'
import sun from '../assets/img/icons/sun.svg'
import mon from '../assets/img/icons/moon.svg'

function ThemeToggler (){
    const [theme, setTheme] = useState('light')

    useEffect(()=>{
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDarkMode){
            setTheme('dark');
            handleToggle()
        }
    },[])

    function handleToggle() {
        
        // Obtén el elemento raíz (root) del documento
        if(theme === 'light')
        {     
            document.body.classList.add("dark-theme") 
            //darkTheme(root);
            setTheme('dark')
        }else{
            document.body.classList.remove("dark-theme") 
            //lightTheme(root);           
            setTheme('light')
        }
           
    }
    return <span className="filter-button theme-icon" 
    style={{backgroundImage: `url(${theme === 'dark' ? sun : mon})`} }
    onClick={()=>handleToggle()}></span>
}


export default ThemeToggler;