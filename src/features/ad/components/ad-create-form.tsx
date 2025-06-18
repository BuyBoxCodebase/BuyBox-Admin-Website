import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AdPlacement, AdStatus, AdTargetType, AdType } from '../data/data';
import { AdsForm, formSchema } from '../data/schema';
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast';
import {  HiOutlineTrash } from 'react-icons/hi'
import { useNavigate } from '@tanstack/react-router';

const MAX_IMAGES = 5;
const CreateAdvertisementForm = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL as string
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('basic');
    const [isAbTest, setIsAbTest] = useState(false);
const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const remainingImageSlots = MAX_IMAGES - uploadedImages.length - selectedFiles.length;
  const canAddMoreImages = remainingImageSlots > 0;
    const form = useForm<AdsForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            type: 'BANNER',
            placement: 'HOME_PAGE',
            content: {},
            targetType: 'ALL_USERS',
            targetConfig: {},
            status: 'DRAFT',
            startDate: undefined,
            endDate: undefined,
            priority: '1',
            maxImpressions: '0',
            maxClicks: '0',
            budget:'0',
            mediaUrls: [],
            isAbTest: false,
            abTestGroup: '',
            scheduleConfig: {},
            displayConditions: {},
            productId: '',
            categoryId: '',
            brandId: '',
        }
    });
    const navigate = useNavigate()

    const onSubmit = async (data: AdsForm) => {
        setIsLoading(true);
        try {
            // Format your data as needed based on the ad type
            const formattedData = {
                ...data,
                // Convert numeric inputs from string to number
                mediaUrls: uploadedImages,
                priority: data.priority ? parseInt(data.priority) : null,
                maxImpressions: data.maxImpressions ? parseInt(data.maxImpressions) : null,
                maxClicks: data.maxClicks ? parseInt(data.maxClicks) : null,
                budget: data.budget ? parseInt(data.budget) : null,
            };
            const response = await fetch(`${baseUrl}/ads/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formattedData),
            });
          //  const result = await response.json();
           // console.log('Advertisement created:', result);
            if(response.ok) {
                // Show success message
                toast({
                    title: 'Advertisement created successfully',
                    description: 'Your advertisement has been created successfully.',
                    variant: 'default',
                });
                navigate({to:'/ad'})
            }
              
            // Reset form or redirect
        } catch (error) {
            console.error('Error creating advertisement:', error);
            alert('Failed to create advertisement. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          const filesArray = Array.from(event.target.files)
          addFiles(filesArray)
        }
      }
    
      const addFiles = (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
        if (imageFiles.length !== files.length) {
          toast({
            title: 'Some files were skipped',
            description: 'Only image files are accepted.',
          })
        }
    
        if (imageFiles.length === 0) return
        const totalCount = selectedFiles.length + uploadedImages.length + imageFiles.length
    
        if (totalCount > MAX_IMAGES) {
          toast({
            title: 'Maximum images limit reached',
            description: `You can only upload a maximum of ${MAX_IMAGES} images. ${MAX_IMAGES - uploadedImages.length} slots remaining.`,
          })
          const remainingSlots = MAX_IMAGES - uploadedImages.length - selectedFiles.length
          if (remainingSlots <= 0) return
    
          const limitedFiles = imageFiles.slice(0, remainingSlots)
          setSelectedFiles((prev) => [...prev, ...limitedFiles])
          const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file))
          setPreviewUrls((prev) => [...prev, ...newPreviews])
        } else {
          setSelectedFiles((prev) => [...prev, ...imageFiles])
          const newPreviews = imageFiles.map((file) => URL.createObjectURL(file))
          setPreviewUrls((prev) => [...prev, ...newPreviews])
        }
      }
    
      const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    
        if (e.dataTransfer.files.length > 0) {
          const filesArray = Array.from(e.dataTransfer.files)
          addFiles(filesArray)
        }
      }
    
      const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
      }
    
      const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      }
    
      const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false)
        }
      }
    
      const handleBrowseClick = () => {
        if (uploadedImages.length >= MAX_IMAGES) {
          toast({
            title: 'Maximum images limit reached',
            description: `You can only upload a maximum of ${MAX_IMAGES} images.`,
          })
          return
        }
    
        if (fileInputRef.current) {
          fileInputRef.current.click()
        }
      }
    
      const removeSelectedImage = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviewUrls((prev) => {
          const newPreviews = [...prev]
          URL.revokeObjectURL(newPreviews[index])
          newPreviews.splice(index, 1)
          return newPreviews
        })
      }
    
      const removeUploadedImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index))
      }
    
      const handleUploadImages = async () => {
        if (selectedFiles.length === 0) {
          toast({
            title: 'No images selected for upload',
            description: 'Please select at least one image.',
          })
          return
        }
        if (uploadedImages.length + selectedFiles.length > MAX_IMAGES) {
          const remainingSlots = MAX_IMAGES - uploadedImages.length
          toast({
            title: 'Too many images',
            description: `You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}.`,
          })
          return
        }
    
        const form = new FormData()
        selectedFiles.forEach((file) => {
          form.append('files', file)
        })
    
        try {
          toast({
            title: 'Uploading images...',
          })
    
          const response = await fetch(`${baseUrl}/ads/upload/images`, {
            method: 'POST',
            body: form,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
    
          if (!response.ok) {
            toast({
              title: 'Failed to upload images',
              description: 'Please try again.',
            })
            return
          }
    
          const data = await response.json()
          setUploadedImages((prev) => [
            ...prev,
            ...data.map((d: { url: string }) => d.url)
          ])
    
          setSelectedFiles([])
          setPreviewUrls([])
    
          toast({
            title: 'Images uploaded successfully',
          })
        } catch (error) {
          console.error('Error uploading images:', error)
          toast({
            title: 'Failed to upload images',
            description: 'Please try again.',
          })
        }
      }

    // Render different content form based on selected ad type
    const renderContentForm = () => {
        const adType = form.watch('type');

        switch (adType) {
            case 'BANNER':
                return (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content.imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banner Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/banner.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content.linkUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/landing-page" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content.altText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alt Text</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Banner alt text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            case 'POPUP':
                return (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content.title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Popup Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Special Offer!" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content.body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Popup Body</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter popup content here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content.buttonText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Button Text</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Shop Now" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content.buttonUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Button URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/offer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            case 'CAROUSEL':
                return (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Add at least 2 slides for your carousel</p>
                        {/* This is simplified - you'd need to implement array fields properly */}
                        <div className="p-4 border rounded-md">
                            <h4 className="font-medium mb-2">Slide 1</h4>
                            <div className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="content.slides.0.imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/slide1.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content.slides.0.caption"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Caption</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slide 1 caption" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content.slides.0.linkUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/slide1-link" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="p-4 border rounded-md">
                            <h4 className="font-medium mb-2">Slide 2</h4>
                            <div className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="content.slides.1.imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/slide2.jpg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content.slides.1.caption"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Caption</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slide 2 caption" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content.slides.1.linkUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/slide2-link" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button variant="outline" type="button" className="w-full">+ Add Another Slide</Button>
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Custom Content (JSON)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='{"key": "value"}'
                                            className="font-mono h-48"
                                            value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                                            onChange={e => {
                                                try {
                                                    field.onChange(JSON.parse(e.target.value));
                                                } catch {
                                                    field.onChange(e.target.value);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter content as JSON based on your ad type requirements
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Create Advertisement</h1>
                    <p className="text-muted-foreground">Create a new advertisement campaign for your store</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                            <TabsList className="w-full h-full grid grid-cols-3 md:grid-cols-5 gap-1">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="content">Content</TabsTrigger>
                                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                            </TabsList>

                            {/* Basic Info Tab */}
                            <TabsContent value="basic" className="p-4 border rounded-lg">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Summer Sale Campaign" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ad Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select ad type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {AdType.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Describe this advertisement campaign..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="placement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Placement</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select ad placement" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {AdPlacement.map((placement) => (
                                                            <SelectItem key={placement.value} value={placement.value}>
                                                                {placement.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {AdStatus.map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" max="10" {...field} />
                                                </FormControl>
                                                <FormDescription>Higher number = higher priority</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>

                            {/* Content Tab */}
                            <TabsContent value="content" className="p-4 border rounded-lg">
                                <div className="space-y-6">
                                    <div className="grid gap-4 p-4 border rounded-md bg-muted/20">
                                        <h3 className="text-lg font-medium">Ad Content</h3>
                                        {renderContentForm()}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Ad Images</FormLabel>
                                            <span className="text-sm text-gray-500">
                                                {uploadedImages.length} of {MAX_IMAGES} images
                                            </span>
                                        </div>

                                        {canAddMoreImages ? (
                                            <div
                                                className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-md ${!canAddMoreImages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                                    } ${isDragging ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                                                    } transition-colors duration-200`}
                                                onDrop={canAddMoreImages ? handleDrop : undefined}
                                                onDragOver={canAddMoreImages ? handleDragOver : undefined}
                                                onDragEnter={canAddMoreImages ? handleDragEnter : undefined}
                                                onDragLeave={canAddMoreImages ? handleDragLeave : undefined}
                                                onClick={canAddMoreImages ? handleBrowseClick : undefined}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className={`w-8 h-8 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-500'}`}
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 20 16"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                        />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to select</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        SVG, PNG, JPG (MAX. 1000x1000px) - {remainingImageSlots} slot{remainingImageSlots !== 1 ? 's' : ''} left
                                                    </p>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileSelect}
                                                    multiple
                                                    accept="image/*"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center w-full py-4 bg-gray-50 border border-gray-200 rounded-md">
                                                <p className="text-sm text-gray-500">Maximum of {MAX_IMAGES} images allowed. Remove some images to add more.</p>
                                            </div>
                                        )}

                                        {previewUrls.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="grid md:grid-cols-7 gap-2 grid-cols-3">
                                                    {previewUrls.map((url, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={url}
                                                                alt={`Selected preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-md"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md"></div>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent triggering file input click
                                                                    removeSelectedImage(index);
                                                                }}
                                                            >
                                                                <HiOutlineTrash className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <Button
                                                    type="button"
                                                    onClick={handleUploadImages}
                                                    variant="secondary"
                                                    className="w-full"
                                                >
                                                    Upload Selected Images
                                                </Button>
                                            </div>
                                        )}

                                        {uploadedImages.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Uploaded Images</h3>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {uploadedImages.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={image}
                                                                alt={`Uploaded image ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-md"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md"></div>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeUploadedImage(index);
                                                                }}
                                                            >
                                                                <HiOutlineTrash className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Related Items</h3>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <FormField
                                                control={form.control}
                                                name="productId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Product ID</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Product ID" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="categoryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category ID</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Category ID" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="brandId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Brand ID</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Brand ID" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Targeting Tab */}
                            <TabsContent value="targeting" className="p-4 border rounded-lg">
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="targetType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target Audience Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select target type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {AdTargetType.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch('targetType') !== 'ALL_USERS' && (
                                        <FormField
                                            control={form.control}
                                            name="targetConfig"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Target Configuration</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder='{"interests": ["fashion", "technology"], "location": "NY"}'
                                                            className="font-mono h-48"
                                                            value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                                                            onChange={e => {
                                                                try {
                                                                    field.onChange(JSON.parse(e.target.value));
                                                                } catch {
                                                                    field.onChange(e.target.value);
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Enter target configuration as JSON based on your target type
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </TabsContent>

                            {/* Scheduling Tab */}
                            <TabsContent value="scheduling" className="p-4 border rounded-lg">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full pl-3 text-left font-normal"
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        {/* This is a placeholder - you'd need to implement a calendar picker */}
                                                        <div className="p-4">
                                                            <Input
                                                                type="datetime-local"
                                                                value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full pl-3 text-left font-normal"
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        {/* This is a placeholder - you'd need to implement a calendar picker */}
                                                        <div className="p-4">
                                                            <Input
                                                                type="datetime-local"
                                                                value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                                                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="scheduleConfig"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>Schedule Configuration</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='{"days": ["mon", "wed", "fri"], "times": ["9:00-12:00", "13:00-17:00"]}'
                                                        className="font-mono h-24"
                                                        value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                                                        onChange={e => {
                                                            try {
                                                                field.onChange(JSON.parse(e.target.value));
                                                            } catch {
                                                                field.onChange(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Configure complex scheduling as JSON (specific days, times)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="displayConditions"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>Display Conditions</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='{"weather": ["sunny", "rainy"], "userState": ["logged-in"], "device": ["mobile", "desktop"]}'
                                                        className="font-mono h-24"
                                                        value={typeof field.value === 'object' ? JSON.stringify(field.value, null, 2) : field.value}
                                                        onChange={e => {
                                                            try {
                                                                field.onChange(JSON.parse(e.target.value));
                                                            } catch {
                                                                field.onChange(e.target.value);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Set conditions for when to display the ad
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TabsContent>

                            {/* Advanced Tab */}
                            <TabsContent value="advanced" className="p-4 border rounded-lg">
                                <div className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="maxImpressions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Impressions</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="10000"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Maximum number of times to show this ad
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="maxClicks"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Clicks</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="1000"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Maximum clicks before ad is paused
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="budget"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Budget</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="500.00"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Budget for paid ads
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-lg font-medium mb-4">A/B Testing</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="isAbTest"
                                                    checked={isAbTest}
                                                    onCheckedChange={(checked) => {
                                                        setIsAbTest(checked);
                                                        form.setValue('isAbTest', checked);
                                                    }}
                                                />
                                                <label
                                                    htmlFor="isAbTest"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Enable A/B Testing
                                                </label>
                                            </div>

                                            {isAbTest && (
                                                <FormField
                                                    control={form.control}
                                                    name="abTestGroup"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>A/B Test Group</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Group A" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Identifier for this variation in the A/B test
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Advertisement'}
                            </Button>
                        </div>
                    </form>
                </Form>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Form Completion</CardTitle>
                        <CardDescription>Track your progress creating this advertisement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Basic Information</p>
                                    <p className="text-sm text-muted-foreground">
                                        Ad title, type, and basic settings
                                    </p>
                                </div>
                                <Badge variant={form.watch('title') ? 'default' : 'outline'}>
                                    {form.watch('title') ? 'Complete' : 'Incomplete'}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Content Configuration</p>
                                    <p className="text-sm text-muted-foreground">
                                        Ad content based on selected type
                                    </p>
                                </div>
                                <Badge variant={form.watch('type') !== 'BANNER' || form.watch('content.imageUrl') ? 'default' : 'outline'}>
                                    {form.watch('type') !== 'BANNER' || form.watch('content.imageUrl') ? 'Complete' : 'Incomplete'}
                                </Badge>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Targeting</p>
                                    <p className="text-sm text-muted-foreground">
                                        Who will see this advertisement
                                    </p>
                                </div>
                                <Badge variant="default">Complete</Badge>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Scheduling</p>
                                    <p className="text-sm text-muted-foreground">
                                        When this ad will be displayed
                                    </p>
                                </div>
                                <Badge variant={form.watch('startDate') ? 'default' : 'outline'}>
                                    {form.watch('startDate') ? 'Complete' : 'Incomplete'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateAdvertisementForm;