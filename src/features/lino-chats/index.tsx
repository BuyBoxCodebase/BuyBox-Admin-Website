import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { IconMessages, IconEye } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import axios from 'axios'

export default function LinoChats() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/lino/admin/conversations`)
        setConversations(response.data)
      } catch (error) {
        console.error('Failed to load lino conversations', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversations()
  }, [])

  const handleViewChat = (chat: any) => {
    setSelectedSession(chat)
    setIsModalOpen(true)
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconMessages size={24} className='text-muted-foreground' />
            <h1 className='text-2xl font-bold tracking-tight'>Lino AI Chats</h1>
          </div>
        </div>

        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-24 text-center'>
                    Loading sessions...
                  </TableCell>
                </TableRow>
              ) : conversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-24 text-center'>
                    No AI conversations found.
                  </TableCell>
                </TableRow>
              ) : (
                conversations.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell className='font-medium'>{chat.sessionId}</TableCell>
                    <TableCell>
                      {format(new Date(chat.createdAt), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>{chat.messages?.length || 0} messages</TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-2'
                        onClick={() => handleViewChat(chat)}
                      >
                        <IconEye size={16} />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-3xl h-[85vh] flex flex-col p-0 gap-0'>
          <DialogHeader className='px-6 py-4 border-b flex-none'>
            <DialogTitle className='flex items-center gap-2'>
              <IconMessages size={20} className='text-muted-foreground' />
              Session: {selectedSession?.sessionId}
            </DialogTitle>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-4 sm:p-6 bg-background'>
            <div className='flex flex-col gap-4 w-full'>
              {selectedSession?.messages?.length === 0 && (
                <div className='text-center text-muted-foreground py-10'>
                  No messages in this session.
                </div>
              )}
              {selectedSession?.messages?.map((msg: any, index: number) => (
                <div 
                  key={msg.id || index}
                  className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      'flex flex-col max-w-[80%] min-w-0 break-words px-4 py-3 shadow-sm text-sm overflow-hidden',
                      msg.role === 'user'
                        ? 'rounded-[20px_20px_4px_20px] bg-primary text-primary-foreground'
                        : 'rounded-[20px_20px_20px_4px] bg-secondary'
                    )}
                  >
                    <div className='whitespace-pre-wrap leading-relaxed'>{msg.content}</div>
                    
                    {/* Products rendering */}
                    {msg.metadata?.products && msg.metadata.products.length > 0 && (
                      <div className='mt-3 p-3 bg-background/50 rounded-md text-[11px] border text-foreground w-full overflow-hidden'>
                        <p className='font-bold mb-2 opacity-70'>RECOMMENDED PRODUCTS:</p>
                        <div className='flex gap-2 overflow-x-auto pb-2 snap-x'>
                          {msg.metadata.products.map((p: any) => (
                            <div key={p.id} className='flex-none w-32 flex flex-col gap-1.5 border rounded-md bg-background p-2 shadow-sm snap-start'>
                              {p.image ? (
                                <img src={p.image} alt={p.name} className='w-full h-20 object-cover rounded bg-muted' />
                              ) : (
                                <div className='w-full h-20 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground'>No Image</div>
                              )}
                              <span className='font-semibold line-clamp-2 leading-tight' title={p.name}>{p.name}</span>
                              <span className='text-muted-foreground mt-auto'>${p.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <span
                      className={cn(
                        'mt-1.5 block text-[10px] font-medium opacity-60',
                        msg.role === 'user' ? 'text-right opacity-80' : 'text-left'
                      )}
                    >
                      {format(new Date(msg.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
