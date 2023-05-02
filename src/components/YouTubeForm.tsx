import React, { useEffect } from 'react';

import { DevTool } from '@hookform/devtools';
import { useForm } from 'react-hook-form';

export interface FormValues {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
}

export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const data = await response.json();
      return {
        username: 'Batman',
        email: data.email,
        channel: '',
        social: {
          twitter: '',
          facebook: '',
        },
        phoneNumbers: ['', ''],
      };
    },
  });
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted', data);
  };

  const watchUserName = watch(['username', 'email']);
  const watchForm = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div>
      <h2>Watched Value: {watchUserName}</h2>
      <h2>Watched form value: {JSON.stringify(watchForm)}</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='form-control'>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            {...register('username', {
              required: {
                value: true,
                message: 'Username is required',
              },
            })}
          />
          <p className='error'>{errors.username?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            {...register('email', {
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email format',
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return fieldValue !== 'admin@example.com' || 'Enter  a different email address';
                },
                notBlackListed: (fieldValue) => {
                  return !fieldValue.endsWith('baddomain.com') || 'This domain is not supported';
                },
              },
            })}
          />
          <p className='error'>{errors.email?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='channel'>Channel</label>
          <input
            type='text'
            id='channel'
            {...register('channel', {
              required: {
                value: true,
                message: 'Channel is required',
              },
            })}
          />
          <p className='error'>{errors.channel?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='Twitter'>Twitter</label>
          <input
            type='text'
            id='twitter'
            {...register('social.twitter', {
              required: {
                value: true,
                message: 'Twitter is required',
              },
            })}
          />
          <p className='error'>{errors.social?.twitter?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='facebook'>Facebook</label>
          <input
            type='text'
            id='facebook'
            {...register('social.facebook', {
              required: {
                value: true,
                message: 'Facebook is required',
              },
            })}
          />
          <p className='error'>{errors.social?.facebook?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='primary-phone'>Primary phone number</label>
          <input
            type='text'
            id='primary-phone'
            {...register('phoneNumbers.0', {
              required: {
                value: true,
                message: 'Primary phone number is required',
              },
            })}
          />
          <p className='error'>{errors.phoneNumbers?.[0]?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='secondary-phone'>Secondary phone number</label>
          <input type='text' id='secondary-phone' {...register('phoneNumbers.1')} />
        </div>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
