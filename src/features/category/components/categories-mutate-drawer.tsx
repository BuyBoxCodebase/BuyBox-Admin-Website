import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Category } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
  baseUrl?: string
  isCategory?: boolean
}

const formSchema = z.object({
  categoryName: z.string().min(1, 'Name is required.'),
  priority: z.string().transform((val) => parseInt(val) || 0),
  imageUrl: z.string().optional(),
})

type TasksForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  baseUrl = import.meta.env.VITE_BASE_URL as string,
  isCategory = true,
}: Props) {
  const isUpdate = !!currentRow
  //console.log('Current Row', currentRow)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ? {
      categoryName: currentRow.name || '',
      imageUrl: currentRow.imageUrl || '',
      priority: currentRow.priority || 0,
    } : {
      categoryName: '',
      imageUrl: '',
      priority: 0,
    }
  })

  // Set the initial image URL when in update mode
  useEffect(() => {
    if (isUpdate && currentRow?.imageUrl) {
      setUploadedImageUrl(currentRow.imageUrl)
    } else {
      setUploadedImageUrl(null)
    }
  }, [isUpdate, currentRow, open])

  const onSubmit = async (data: TasksForm) => {
    // console.log('Inside onSubmit')
    // console.log('Data', uploadedImageUrl)
    const formData = {
      ...data,
      imageUrl: uploadedImageUrl || '',
      categoryName: isCategory ? data.categoryName : null,
      subCategoryName: isCategory ? null : data.categoryName,
      categoryId: currentRow?.id,
    }
    //console.log(formData)
    const url = isCategory
      ? `${baseUrl}/category/${isUpdate ? "update" : "create"}`
      : `${baseUrl}/category/create/sub-category`
    const response = await fetch(url, {
      method: isCategory ? isUpdate ? 'PATCH' : 'POST' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    })
    if (!response.ok) {
      toast({
        title: `Failed to create ${isCategory ? 'category' : 'Sub category'}`,
        description: 'Please try again.',
      })
      return
    }
    //const dataa = await response.json()
    //console.log(dataa)
    onOpenChange(false)
    form.reset()
    setUploadedImageUrl(null)
    toast({
      title: `${isCategory ? 'Category' : 'Sub Category'} ${isUpdate ? 'updated' : 'created'} successfully`,
    })
  }

  const handleFileUpload = (_file: File | null, url?: string) => {
    if (url) {
      //console.log('Inside handleFileUpload')
      //console.log('Url', url)
      setUploadedImageUrl(url)
    } else {
      setUploadedImageUrl(null)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
        if (!v) {
          setUploadedImageUrl(null)
        }
      }}
    >
      <SheetContent className='flex flex-col overflow-y-auto max-h-screen'>
        <SheetHeader className='text-left'>
          <SheetTitle>
            {isUpdate ? 'Update' : 'Create'}{' '}
            {isCategory ? 'Category' : 'Sub Category'}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5'
          >
            <FormField
              control={form.control}
              name='categoryName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter the name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter the priority'
                      type='number'
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    More the number, more the priority.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='imageUrl'
              render={() => (
                <FormItem className='space-y-1'>
                  <FormLabel>Upload Image (PNG/JPG only)</FormLabel>
                  <FormControl>
                    <FileUpload
                      baseUrl={baseUrl}
                      onChange={handleFileUpload}
                      initialImageUrl={uploadedImageUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}