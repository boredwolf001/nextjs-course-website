'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EditFormField({
  form,
  editField,
  fieldName,
  fieldDescription,
  fieldDisplayName,
}: {
  form: any
  editField: (editingField: string, value: any) => void
  fieldName: string
  fieldDisplayName: string
  fieldDescription: string
}) {
  return (
    <form
      onSubmit={form.handleSubmit((values: any) =>
        editField(fieldName, values[fieldName])
      )}
      className='bg-muted p-4 rounded-md shadow-sm'>
      <h1 className='text-lg font-bold mt-4'>{fieldDisplayName}</h1>
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder={fieldDisplayName} {...field} />
            </FormControl>
            <FormDescription>{fieldDescription}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type='submit' variant='outline' className='mt-4'>
        Update {fieldDisplayName}
      </Button>
    </form>
  )
}
