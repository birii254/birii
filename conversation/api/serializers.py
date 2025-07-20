from rest_framework import serializers
from ..models import Conversation, ConversationMessage
from accounts.api.serializers import UserSerializer
from item.api.serializers import ItemSerializer

class ConversationMessageSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ConversationMessage
        fields = ['id', 'content', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class ConversationSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    item = ItemSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'item', 'members', 'created_at', 'modified_at', 'last_message', 'unread_count']
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return last_message.content
        return None
    
    def get_unread_count(self, obj):
        # For now, return 0. You can implement read status tracking later
        return 0