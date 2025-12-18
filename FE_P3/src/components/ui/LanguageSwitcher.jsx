import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@mui/material';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <ButtonGroup variant="outlined" size="small" aria-label="language switcher">
            <Button
                onClick={() => changeLanguage('vi')}
                variant={i18n.language === 'vi' ? 'contained' : 'outlined'}
            >
                🇻🇳 VI
            </Button>
            <Button
                onClick={() => changeLanguage('en')}
                variant={i18n.language === 'en' ? 'contained' : 'outlined'}
            >
                🇺🇸 EN
            </Button>
        </ButtonGroup>
    );
};

export default LanguageSwitcher;