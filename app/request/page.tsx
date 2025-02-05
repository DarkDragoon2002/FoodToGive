'use client';

import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Request = () => {
  const session = useSession();
  const router = useRouter();

  // if (!session.data) {
  //   router.replace('/');
  // } else if (session.data.user.role !== 'donor') {
  //   router.replace('/dashboard');
  // }

  const cookedFormSchema = z.object({
    foodName: z.string().min(2, {
      message: 'Food name must be at least 2 characters.',
    }),
    needByTime: z.string().nonempty({
      message: 'Date/Time the food is needed by is required.',
    }),
    specialRequest: z.string(),
    numberOfServings: z.number().min(1, {
      message: 'Number of servings must be at least 1.',
    }),
    deliveryMethod: z.string(),
    deliveryTime: z.string().optional(),
    deliveryLocation: z.string().optional(),
  });

  const nonCookedFormSchema = z.object({
    foodName: z.string().min(2, {
      message: 'Food name must be at least 2 characters.',
    }),
    needByTime: z.string().nonempty({
      message: 'Date/Time the food is needed by is required.',
    }),
    foodCategory: z.string().nonempty({
      message: 'Food Category is required.',
    }),
    specialRequest: z.string(),
    quantity: z.number().min(1, {
      message: 'Quantity of food must be at least 1.',
    }),
    deliveryMethod: z.string(),
    deliveryTime: z.string().optional(),
    deliveryLocation: z.string().optional(),
  });

  const cookedForm = useForm<z.infer<typeof cookedFormSchema>>({
    resolver: zodResolver(cookedFormSchema),
    defaultValues: {
      foodName: '',
      needByTime: '',
      specialRequest: '',
      numberOfServings: 0,
    },
  });

  const nonCookedForm = useForm<z.infer<typeof nonCookedFormSchema>>({
    resolver: zodResolver(nonCookedFormSchema),
    defaultValues: {
      foodName: '',
      needByTime: '',
      foodCategory: '',
      specialRequest: '',
      quantity: 0,
    },
  });

  function onSubmit(values: any) {
    // make api call to save donation details in mongodb
    if (foodType === 'Cooked Food') {
      cookedForm.reset({
        foodName: '',
        needByTime: '',
        specialRequest: '',
        numberOfServings: 0,
        deliveryMethod: '',
      });
    } else {
      nonCookedForm.reset({
        foodName: '',
        needByTime: '',
        foodCategory: '',
        specialRequest: '',
        quantity: 0,
        deliveryMethod: '',
      });
      setSelectedCategory('');
    }
  }
  const [selectedCategory, setSelectedCategory] = useState('');
  const [foodType, setFoodType] = useState('Non-Cooked Food');

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      {/* Navigation Bar */}
      <Header />

      {/* Form Content */}
      <section className='bg-white rounded-lg shadow-lg p-12 mb-12 flex justify-center'>
        <div className='flex flex-col items-center w-full max-w-4xl'>
          <h1 className='text-2xl font-bold mb-2'>Request for Food</h1>
          <p className='text-sm text-gray-700 mb-7'>
            Require food for your organisation? Fill in the form below to
            request for food donations from our donors. We will do our best to
            match you with a donor as soon as possible!
          </p>

          <div className='flex justify-center space-x-4 mb-6'>
            <button
              className={`px-4 py-2 rounded-md font-semibold ${
                foodType === 'Non-Cooked Food'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setFoodType('Non-Cooked Food')}
            >
              Non-Cooked Food
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold ${
                foodType === 'Cooked Food'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setFoodType('Cooked Food')}
            >
              Cooked Food
            </button>
          </div>

          {foodType === 'Cooked Food' ? (
            <Form key='cookedForm' {...cookedForm}>
              <form
                onSubmit={cookedForm.handleSubmit(onSubmit)}
                className='space-y-4 w-full max-w-s mx-auto'
              >
                <FormField
                  control={cookedForm.control}
                  name='foodName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <Input className='shadow-sm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cookedForm.control}
                  name='numberOfServings'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Servings</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='1'
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          className='w-full shadow-sm'
                        />
                      </FormControl>
                      <FormDescription>
                        This does not have to be accurate. An estimate will do!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cookedForm.control}
                  name='specialRequest'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Special Requests (e.g. dietary restrictions)
                      </FormLabel>
                      <FormControl>
                        <Input className='shadow-sm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cookedForm.control}
                  name='needByTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Food By</FormLabel>
                      <FormControl>
                        <Input
                          className='shadow-sm'
                          type='datetime-local'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cookedForm.control}
                  name='deliveryMethod'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3'>
                            <FormControl>
                              <RadioGroupItem value='selfPickup' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              I will pick up the food
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3'>
                            <FormControl>
                              <RadioGroupItem value='deliverToMe' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Please deliver the food to me
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {cookedForm.watch('deliveryMethod') === 'deliverToMe' && (
                  <>
                    <FormField
                      control={cookedForm.control}
                      name='deliveryLocation'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Location</FormLabel>
                          <FormControl>
                            <Input className='shadow-sm' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cookedForm.control}
                      name='deliveryTime'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Delivery Time</FormLabel>
                          <FormControl>
                            <Input
                              className='shadow-sm'
                              type='datetime-local'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className='flex justify-end'>
                  <Button type='submit'>Submit</Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form key='nonCookedForm' {...nonCookedForm}>
              <form
                onSubmit={nonCookedForm.handleSubmit(onSubmit)}
                className='space-y-4 w-full max-w-s mx-auto'
              >
                <FormField
                  control={nonCookedForm.control}
                  name='foodName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <Input className='w-full shadow-sm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={nonCookedForm.control}
                  name='foodCategory'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ''}
                          onValueChange={(value) => {
                            setSelectedCategory(value);
                            field.onChange(value); // Updates the form state
                          }}
                        >
                          <SelectTrigger className='w-full shadow-sm'>
                            <SelectValue placeholder='Select Food Type' />
                          </SelectTrigger>
                          <SelectContent className='w-full'>
                            <SelectItem value='Vegetables'>
                              Vegetables
                            </SelectItem>
                            <SelectItem value='Canned Food'>
                              Canned Food
                            </SelectItem>
                            <SelectItem value='Fruits'>Fruits</SelectItem>
                            <SelectItem value='Dry Goods'>Dry Goods</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nonCookedForm.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity of Items</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          className='w-full shadow-sm'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nonCookedForm.control}
                  name='specialRequest'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Special Requests (e.g. dietary restrictions)
                      </FormLabel>
                      <FormControl>
                        <Input className='shadow-sm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cookedForm.control}
                  name='needByTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Food By</FormLabel>
                      <FormControl>
                        <Input
                          className='shadow-sm'
                          type='datetime-local'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={nonCookedForm.control}
                  name='deliveryMethod'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3'>
                            <FormControl>
                              <RadioGroupItem value='selfPickup' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              I will pick up the food
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3'>
                            <FormControl>
                              <RadioGroupItem value='deliverToMe' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Please deliver the food to me
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {nonCookedForm.watch('deliveryMethod') === 'deliverToMe' && (
                  <>
                    <FormField
                      control={nonCookedForm.control}
                      name='deliveryLocation'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Location</FormLabel>
                          <FormControl>
                            <Input className='shadow-sm' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={nonCookedForm.control}
                      name='deliveryTime'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Delivery Time</FormLabel>
                          <FormControl>
                            <Input
                              className='shadow-sm'
                              type='datetime-local'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className='flex justify-end'>
                  <Button type='submit'>Submit</Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Request;
