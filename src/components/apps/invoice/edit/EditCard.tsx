// ** React Imports
import { Icon } from '@iconify/react';
import { FormControl, FormHelperText } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent, { CardContentProps } from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import { styled, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Cleave from 'cleave.js/react';
import Image from 'next/image';
import { useEffect } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

import { InvoiceType } from '../../../../types/apps/invoiceTypes';
import CleaveWrapper from '../../../shared/react-cleave';
import Repeater from '../../../shared/repeater';

import EditActions from './EditActions';

interface Props {
  control: any;
  errors: any;
  formValues: any;
  setValue: (a: any, b: any) => void;
  invoiceData: InvoiceType;
  invoiceStore: any;
  id: string | undefined;
  toggleAddPaymentDrawer: () => void;
  toggleSendInvoiceDrawer: () => void;
}

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2),
  },
}));

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-2.25rem',
    position: 'absolute',
  },
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative',
    },
  },
}));

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(16, 10, 10),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6),
  },
}));

const InvoiceAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

const EditCard = (props: Props) => {
  // ** Props
  const {
    setValue,
    control,
    errors,
    formValues,
    invoiceData,
    id,
    toggleSendInvoiceDrawer,
    toggleAddPaymentDrawer,
    invoiceStore,
  } = props;

  // ** Hook
  const theme = useTheme();

  // Get the items field array methods from react-hook-form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const calculateSubtotal = () => {
    // Calculate the subtotal based on the sum of all actual item prices without discount
    const subtotal = formValues.items.reduce((total: any, item: any) => {
      const cost = parseFloat(item.cost || 0);
      return total + cost;
    }, 0);

    setValue('subtotal', subtotal);
  };

  const calculateFinalTotal = () => {
    const subtotal = parseFloat(formValues.subtotal || 0);
    const tax = parseFloat(formValues.tax || 0);
    const aplicableTax = subtotal * (tax / 100);

    // Calculate the final total based on the formula: subtotal - totalDiscount - (subtotal * tax / 100)
    const finalTotal = subtotal + aplicableTax;
    setValue('finalTotal', finalTotal);
  };

  useEffect(() => {
    calculateSubtotal();
  }, [fields?.length]);

  useEffect(() => {
    calculateFinalTotal();
  }, [formValues?.subtotal, formValues?.tax]);

  return (
    <Card>
      <CardContent
        sx={{
          p: [
            `${theme.spacing(6)} !important`,
            `${theme.spacing(10)} !important`,
          ],
        }}
      >
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/images/icons/project-icons/logo.png"
                  alt="Logo"
                  width={200}
                  height={100}
                />
              </Box>
              <div>
                <Typography sx={{ color: 'text.secondary' }}>
                  <Icon
                    icon="tabler:map-pin"
                    fontSize={16}
                    style={{ marginRight: 10 }}
                  />
                  {invoiceData?.companyAddress}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  <Icon
                    icon="tabler:phone"
                    fontSize={16}
                    style={{ marginRight: 10 }}
                  />{' '}
                  {invoiceData?.companyPhoneNumber}
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xl={6} xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xl: 'flex-end', xs: 'flex-start' },
              }}
            >
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name="issuedDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Issued Date"
                          value={value}
                          format={'MM-DD-YYYY'}
                          onChange={onChange}
                          slotProps={{ textField: { size: 'small' } }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.issuedDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.issuedDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name="dueDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Due Date"
                          value={value}
                          format={'MM-DD-YYYY'}
                          onChange={onChange}
                          slotProps={{ textField: { size: 'small' } }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.dueDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.dueDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent
        sx={{
          p: [
            `${theme.spacing(6)} !important`,
            `${theme.spacing(10)} !important`,
          ],
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography sx={{ mb: 6, fontWeight: 500 }}>Invoice To:</Typography>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name={'customerName'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type={'text'}
                    value={value}
                    label={'Customer Name'}
                    size="small"
                    onChange={onChange}
                  />
                )}
              />
              {errors.customerName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.customerName as any).message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name={'customerEmail'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type={'email'}
                    value={value}
                    label={'Customer Email'}
                    size="small"
                    onChange={onChange}
                  />
                )}
              />
              {errors.customerEmail && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.customerEmail as any).message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              {formValues?.customerPhoneNumber?.replace(/\-/g, '').length >
              10 ? (
                <Controller
                  name="customerPhoneNumber"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type="number"
                      value={value?.replace(/\-/g, '')}
                      label="Customer Phone Number"
                      size="small"
                      onChange={onChange}
                      error={Boolean(errors.customerPhoneNumber)}
                    />
                  )}
                />
              ) : (
                <>
                  {formValues?.customerPhoneNumber && (
                    <InputLabel
                      error={Boolean(errors.customerPhoneNumber)}
                      htmlFor="customerPhoneNumber"
                      size="small"
                      sx={{
                        padding: '0px 5px',
                        transform: 'translate(9px, -9px) scale(0.75)',
                        maxWidth: 'calc(133% - 32px)',
                        backgroundColor: 'background.paper',
                      }}
                    >
                      Customer Phone Number
                    </InputLabel>
                  )}
                  <Controller
                    name="customerPhoneNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CleaveWrapper theme={theme}>
                        <Cleave
                          id={'customerPhoneNumber'}
                          value={value}
                          name={'customerPhoneNumber'}
                          placeholder="Customer Phone Number"
                          onChange={onChange}
                          autoComplete={'off'}
                          options={{
                            delimiter: '-',
                            blocks: [3, 3, 100],
                            numericOnly: true,
                          }}
                          className={`form-control${
                            errors.customerPhoneNumber && true
                              ? ' is-invalid'
                              : ''
                          }`}
                        />
                      </CleaveWrapper>
                    )}
                  />
                </>
              )}
              {errors.customerPhoneNumber && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.customerPhoneNumber.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name={'customerCompanyName'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type={'text'}
                    value={value}
                    label={'Customer Company Name'}
                    size="small"
                    onChange={onChange}
                  />
                )}
              />
              {errors.customerCompanyName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.customerCompanyName as any).message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name={'customerAddress'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type={'text'}
                    value={value}
                    label={'Customer Address'}
                    size="small"
                    onChange={onChange}
                  />
                )}
              />
              {errors.customerAddress && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.customerAddress as any).message}
                </FormHelperText>
              )}
            </FormControl>

            {/* <Select size='small' value={selected} onChange={handleInvoiceChange} sx={{ mb: 4, width: '200px' }}>
              <CustomSelectItem value='' onClick={handleAddNewCustomer}>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon icon='tabler:plus' fontSize='1.125rem' />
                  Add New Customer
                </Box>
              </CustomSelectItem>
              {clients !== undefined &&
                clients.map(client => (
                  <MenuItem key={client.name} value={client.name}>
                    {client.name}
                  </MenuItem>
                ))}
            </Select>
            {selectedClient !== null && selectedClient !== undefined ? (
              <>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.company}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.address}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.contact}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.companyEmail}</Typography>
              </>
            ) : null} */}
          </Grid>
          {/* <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
            <div>
              <Typography sx={{ mb: 6, fontWeight: 500 }}>Bill To:</Typography>
              <TableContainer>
                <Table>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Total Due:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name={'totalDue'}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type={'number'}
                                value={value}
                                label={''}
                                size='small'
                                onChange={onChange}
                                // sx={{ width: '60%' }}
                              />
                            )}
                          />
                          {errors.totalDue && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {(errors.totalDue as any).message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Bank name:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{invoiceData?.bankName}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>Country:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{invoiceData?.country} </Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>IBAN:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{invoiceData?.iban}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>SWIFT code:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{invoiceData?.swiftCode}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid> */}
        </Grid>
      </CardContent>

      <Divider />

      <RepeaterWrapper>
        <Repeater count={fields.length}>
          {(i: number) => {
            const Tag = i === 0 ? Box : Collapse;

            return (
              <Tag
                key={i}
                className="repeater-wrapper"
                {...(i !== 0 ? { in: true } : {})}
              >
                <Grid container>
                  <RepeatingContent item xs={12}>
                    <Grid
                      container
                      sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}
                    >
                      <Grid
                        item
                        lg={6}
                        md={5}
                        xs={12}
                        sx={{ px: 4, my: { lg: 0, xs: 4 } }}
                      >
                        <Typography
                          className="col-title"
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}
                        >
                          Item
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name={`items[${i}].name`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type={'text'}
                                value={value}
                                label={'Item Name'}
                                size="small"
                                onChange={onChange}
                              />
                            )}
                          />
                          {errors.name && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {(errors.name as any).message}
                            </FormHelperText>
                          )}
                        </FormControl>

                        {/* <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name={`items[${i}].description`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type={'text'}
                                value={value}
                                label={'Item Description'}
                                size='small'
                                onChange={onChange}
                              />
                            )}
                          />
                          {errors.description && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {(errors.description as any).message}
                            </FormHelperText>
                          )}
                        </FormControl> */}
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        md={3}
                        xs={12}
                        sx={{ px: 4, my: { lg: 0, xs: 4 } }}
                      >
                        <Typography
                          className="col-title"
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}
                        >
                          Cost
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name={`items[${i}].cost`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type={'number'}
                                value={value}
                                label={''}
                                size="small"
                                onChange={(e) => {
                                  onChange(e);
                                  calculateSubtotal();
                                }}
                              />
                            )}
                          />
                          {errors.cost && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {(errors.cost as any).message}
                            </FormHelperText>
                          )}
                        </FormControl>
                        {/* <Box sx={{ mt: 3.5 }}>
                          <Typography component='span' sx={{ color: 'text.secondary' }}>
                            Discount(%):
                          </Typography>

                          <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                              name={`items[${i}].discount`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <TextField
                                  type={'number'}
                                  value={value}
                                  label={''}
                                  size='small'
                                  onChange={e => {
                                    onChange(e)
                                    calculatePrice(i) // Call calculatePrice on change
                                  }}
                                />
                              )}
                            />
                            {errors.discount && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {(errors.discount as any).message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Box> */}
                      </Grid>
                      {/* <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          Hours
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name={`items[${i}].hours`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                type={'number'}
                                value={value}
                                label={''}
                                size='small'
                                onChange={e => {
                                  onChange(e)
                                  calculateSubtotal()
                                }}
                              />
                            )}
                          />
                          {errors.hours && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {(errors.hours as any).message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid> */}
                      {/* <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          Price
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Controller
                            name={`items[${i}].price`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField type={'number'} value={value} label={''} size='small' onChange={onChange} />
                            )}
                          />
                          {errors.price && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {(errors.price as any).message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid> */}
                    </Grid>
                    <InvoiceAction>
                      <IconButton size="small" onClick={() => remove(i)}>
                        <Icon icon="tabler:x" fontSize="1.25rem" />
                      </IconButton>
                    </InvoiceAction>
                  </RepeatingContent>
                </Grid>
              </Tag>
            );
          }}
        </Repeater>

        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={12} sx={{ px: 0 }}>
            <Button variant="contained" onClick={() => append({})}>
              Add Item
            </Button>
          </Grid>
        </Grid>
      </RepeaterWrapper>

      <Divider />
      <CardContent
        sx={{
          p: [
            `${theme.spacing(6)} !important`,
            `${theme.spacing(10)} !important`,
          ],
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={7} lg={8} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                Signature:
              </Typography>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name={'authorizedPersonName'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      sx={{ maxWidth: '300px' }}
                      type={'text'}
                      value={value}
                      label={''}
                      size="small"
                      onChange={onChange}
                    />
                  )}
                />
                {errors.authorizedPersonName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {(errors.authorizedPersonName as any).message}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name={'message'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    sx={{ maxWidth: '300px' }}
                    type={'text'}
                    value={value}
                    label={'Message'}
                    size="small"
                    onChange={onChange}
                  />
                )}
              />
              {errors.message && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {(errors.message as any).message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            lg={4}
            sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}
          >
            <CalcWrapper>
              <Typography sx={{ color: 'text.secondary', mr: 3 }}>
                Subtotal($):{' '}
              </Typography>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name={'subtotal'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={'number'}
                      value={value}
                      label={''}
                      size="small"
                      onChange={onChange}
                      disabled
                    />
                  )}
                />
                {errors.subtotal && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {(errors.subtotal as any).message}
                  </FormHelperText>
                )}
              </FormControl>
            </CalcWrapper>
            {/* <CalcWrapper>
              <Typography sx={{ color: 'text.secondary', mr: 3 }}>Discount($): </Typography>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name={'totalDiscount'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={'number'}
                      value={value}
                      label={''}
                      size='small'
                      onChange={onChange}
                      disabled
                      defaultValue={500}
                    />
                  )}
                />
                {errors.totalDiscount && (
                  <FormHelperText sx={{ color: 'error.main' }}>{(errors.totalDiscount as any).message}</FormHelperText>
                )}
              </FormControl>
            </CalcWrapper> */}
            <CalcWrapper sx={{ mb: '0 !important' }}>
              <Typography sx={{ color: 'text.secondary', mr: 3 }}>
                Tax(%):{' '}
              </Typography>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name={'tax'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={'number'}
                      value={value}
                      label={''}
                      size="small"
                      onChange={(e) => {
                        onChange(e);
                        calculateFinalTotal(); // Recalculate finalTotal on tax change
                      }}
                    />
                  )}
                />
                {errors.tax && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {(errors.tax as any).message}
                  </FormHelperText>
                )}
              </FormControl>
            </CalcWrapper>
            <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
            <CalcWrapper>
              <Typography sx={{ color: 'text.secondary', mr: 3 }}>
                Total($):{' '}
              </Typography>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name={'finalTotal'}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={'number'}
                      value={value}
                      label={''}
                      size="small"
                      onChange={onChange}
                      disabled
                    />
                  )}
                />
                {errors.finalTotal && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {(errors.finalTotal as any).message}
                  </FormHelperText>
                )}
              </FormControl>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* <CardContent sx={{ px: [6, 10] }}>
        <InputLabel htmlFor='invoice-note' sx={{ mb: 2, fontWeight: 500, fontSize: '0.875rem' }}>
          Note:
        </InputLabel>
        <TextField
          rows={2}
          fullWidth
          multiline
          id='invoice-note'
          defaultValue={
            invoiceData?.note ||
            'It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
          }
        />
      </CardContent> */}
      <EditActions
        invoiceStore={invoiceStore}
        id={id}
        toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
        toggleAddPaymentDrawer={toggleAddPaymentDrawer}
      />
    </Card>
  );
};

export default EditCard;
