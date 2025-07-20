from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import Conversation, ConversationMessage
from .serializers import ConversationSerializer, ConversationMessageSerializer
from item.models import Item

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Conversation.objects.all()
    
    def get_queryset(self):
        return Conversation.objects.filter(members=self.request.user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all().order_by('created_at')
        serializer = ConversationMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        serializer = ConversationMessageSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                conversation=conversation,
                created_by=request.user
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def create_conversation(self, request):
        item_id = request.data.get('item_id')
        content = request.data.get('content')
        
        if not item_id or not content:
            return Response(
                {'error': 'item_id and content are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        item = get_object_or_404(Item, id=item_id)
        
        if item.created_by == request.user:
            return Response(
                {'error': 'Cannot create conversation with yourself'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if conversation already exists
        existing_conversation = Conversation.objects.filter(
            item=item,
            members=request.user
        ).filter(members=item.created_by).first()
        
        if existing_conversation:
            return Response(
                ConversationSerializer(existing_conversation).data,
                status=status.HTTP_200_OK
            )
        
        # Create new conversation
        conversation = Conversation.objects.create(item=item)
        conversation.members.add(request.user, item.created_by)
        
        # Create first message
        ConversationMessage.objects.create(
            conversation=conversation,
            content=content,
            created_by=request.user
        )
        
        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_201_CREATED
        )