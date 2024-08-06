import { Badge, BadgeProps, styled } from "@mui/material";

interface CustomBadgeProps extends BadgeProps {
    isconnected?:string
}
export const CustomStyledBadge = styled(Badge)<CustomBadgeProps>(({ theme , isconnected="true"}) => ({
    '& .MuiBadge-badge': {
        backgroundColor: ['true',true,"connected"].includes(isconnected) ? '#44b700' :'#e24009',
        color: ['true',true,"connected"].includes(isconnected) ? '#44b700' :'#e24009',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
  }));