import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Button, Drawer, FormControl, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import axios from '../../../utils/axios';
import { PRIMARY_COLOR } from '../../../utils/constant';
import CustomCheckbox from '../../custom/CustomCheckbox';
import CustomHeader from '../../custom/form/CustomHeader';

interface FormType {
  open: boolean;
  menuData: any;
  toggle: () => void;
  selectedId: string[];
  currentData: any;
}

const UserMenuForm = (props: FormType) => {
  const { open, toggle, menuData, selectedId, currentData } = props;
  const [selectedData, setSelectedData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    toggle();
  };

  useEffect(() => {
    if (open) {
      setSelectedData(selectedId);
    }
  }, [open]);

  const onChange = (data: any) => {
    const { id, parentId, children } = data;
    let newArr = [...selectedData];
    const index = newArr.indexOf(id);
    const isChecked = index > -1;

    isChecked ? newArr.splice(index, 1) : newArr.push(id);

    if (children && children.length) {
      const childIds = children.map((child: any) => child.id);
      newArr = isChecked
        ? newArr.filter((item) => !childIds.includes(item))
        : [...newArr, ...childIds];
    }

    if (parentId) {
      const parent = menuData.find((menu: any) => menu.id === parentId);
      const childChecked = parent.children.some((child: any) =>
        newArr.includes(child.id),
      );
      newArr = !childChecked
        ? newArr.filter((item) => item !== parentId)
        : [...newArr, parentId];
    }

    newArr = Array.from(new Set(newArr));
    setSelectedData(newArr);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { id } = currentData;
      const response = await axios.patch(`/users/update-menu/${id}`, {
        menuId: selectedData,
      });
      setLoading(false);
      if (response.status === 200) {
        toast.success('Menu updated successfully');
        handleClose();
      }
    } catch (error) {
      setLoading(false);
      toast.error('API Error! Please try again.');
    }
  };

  const renderMenu = (menuData: any, selectedData: any, onChange: any) => {
    return menuData.map((data: any) => {
      const { title, children, id } = data;

      return (
        <div key={id}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormControlLabel
              label={title}
              control={
                <CustomCheckbox
                  checkedIcon={
                    <Icon
                      icon="tabler:square-filled"
                      fontSize={24}
                      color={PRIMARY_COLOR}
                    />
                  }
                  icon={
                    <Icon
                      icon="tabler:square"
                      fontSize={24}
                      color={PRIMARY_COLOR}
                    />
                  }
                  checked={selectedData.indexOf(id) > -1}
                  onChange={() => onChange(data)}
                />
              }
            />
          </FormControl>
          {children && renderChildren(children, selectedData, onChange)}
        </div>
      );
    });
  };

  const renderChildren = (children: any, selectedData: any, onChange: any) => {
    return children.map((child: any) => {
      const { title, id } = child;

      return (
        <div key={id}>
          <FormControl fullWidth sx={{ mb: 2, ml: 3 }}>
            <FormControlLabel
              label={title}
              control={
                <CustomCheckbox
                  checkedIcon={
                    <Icon
                      icon="tabler:square-filled"
                      fontSize={24}
                      color={PRIMARY_COLOR}
                    />
                  }
                  icon={
                    <Icon
                      icon="tabler:square"
                      fontSize={24}
                      color={PRIMARY_COLOR}
                    />
                  }
                  checked={selectedData.indexOf(id) > -1}
                  onChange={() => onChange(child)}
                />
              }
            />
          </FormControl>
        </div>
      );
    });
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <CustomHeader>
        <Typography variant="h6">Menu Settings</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
          }}
        >
          <IconX />
        </IconButton>
      </CustomHeader>

      <Box sx={{ p: (theme) => theme.spacing(0, 2, 2) }}>
        {renderMenu(menuData, selectedData, onChange)}

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            sx={{ mr: 1,background:'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)' }}
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
          <Button variant="text" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserMenuForm;
