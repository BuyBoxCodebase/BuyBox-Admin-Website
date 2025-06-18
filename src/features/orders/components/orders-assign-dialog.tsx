import  { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { DeliveryAgent } from '@/hooks/users/schema';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import useGetAllDeliveryAgents from '@/hooks/users/useGetDeliveryAgents';
import { Order } from '@/hooks/orders/schema';
interface OrdersAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Order;
}

export function OrdersAssignDialog({
  open,
  onOpenChange,
  currentRow,
}: OrdersAssignDialogProps) {
  const { deliveryAgents, loading } = useGetAllDeliveryAgents({limit: 10, page: 1});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  useEffect(() => {
    if (open) {
      setSelectedAgent(null);
      setSearchTerm('');
    }
  }, [open, currentRow]);
  const filteredAgents = deliveryAgents?.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) && !agent.isAssigned
  ) || [];
  
  const handleAssign = async () => {
    if (!selectedAgent) return;
    
    try {
        await fetch(`${import.meta.env.VITE_BASE_URL}/admin/control/order/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                deliveryAgentId: selectedAgent.id,
                orderId: currentRow.id
            })
        })
       // const data = await response.json()
       // console.log(data)
      console.log(`Assigning order ${currentRow?.id} to agent ${selectedAgent.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign order:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Order to Delivery Agent</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {currentRow && (
            <div className="bg-muted p-3 rounded-md text-sm">
              <p><span className="font-medium">Order ID:</span> {currentRow.id}</p>
              <p><span className="font-medium">Delivery Address:</span> {currentRow.address}</p>
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search delivery agents by name"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading && <p className="text-center text-sm text-muted-foreground">Loading delivery agents...</p>}
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {!loading && filteredAgents.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">No delivery agents found</p>
            )}
            
            {filteredAgents.map((agent) => (
              <div 
                key={agent.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
                  selectedAgent?.id === agent.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {agent.profilePic ? (
                      <AvatarImage src={agent.profilePic} alt={agent.name} />
                    ) : (
                      <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.phoneNumber || agent.email}</p>
                  </div>
                </div>
                {selectedAgent?.id === agent.id && (
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedAgent}
          >
            Assign Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}