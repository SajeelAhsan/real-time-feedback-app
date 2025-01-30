'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/model/User.model.ts';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/type/ApiResponse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({ title: 'Refreshed Messages', description: 'Showing latest messages' });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({ title: response.data.message, variant: 'default' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  const { username } = session?.user || {};
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL copied',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  if (!session || !session.user) {
    return <div className='text-center mt-10'>Please Login</div>;
  }

  return (
    <div className='container mx-auto p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between mb-4'>
            <span>Accept Messages</span>
            <Switch checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
          </div>
          <Button onClick={copyToClipboard}>Copy Profile URL</Button>
          <Button onClick={() => fetchMessages(true)} disabled={isLoading} className='ml-2'>
            {isLoading ? 'Refreshing...' : 'Refresh Messages'}
          </Button>
          <ScrollArea className='mt-4 max-h-60'>
            {isLoading ? (
              <Skeleton className='h-10 w-full mb-2' />
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <Card key={msg._id} className='mt-2'>
                  <CardContent>
                    <p>{msg.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className='text-gray-500'>No messages available</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
