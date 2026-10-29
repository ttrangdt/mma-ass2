import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHOPEE_COLORS } from '../../constants/theme';














const QUICK_PROMPTS = [
'Gợi ý quà sinh nhật dưới $50',
'Mỹ phẩm dưỡng ẩm hot nhất',
'Laptop giá rẻ cho sinh viên',
'Làm sao để lấy Freeship?'];


export const ShopeeAiModal = ({
  visible,
  onClose,
  onSearchProduct
}) => {
  const [messages, setMessages] = useState([
  {
    id: '1',
    sender: 'ai',
    text: 'Xin chào! Em là Trợ lý AI Mua sắm Shopee. Em có thể giúp bạn tìm kiếm sản phẩm hot, so sánh giá, tư vấn quà tặng hoặc giải đáp thắc mắc về đơn hàng!',
    time: 'Vừa xong'
  }]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: 'Bây giờ'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI logic response simulation tailored for e-commerce
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('quà') || lower.includes('sinh nhật')) {
        reply =
        'Gợi ý tuyệt vời cho quà tặng: Nước hoa cao cấp (như Chanel Coco Noir, Dior Sauvage), son môi dưỡng ẩm, hoặc tai nghe Bluetooth không dây! Bạn có muốn em tìm kiếm nhóm này không?';
      } else if (lower.includes('mỹ phẩm') || lower.includes('da') || lower.includes('beauty')) {
        reply =
        'Các dòng sản phẩm chăm sóc da bán chạy nhất tuần này: Serum phục hồi da, Kem chống nắng nâng tone SPF 50+, và Nước hoa hồng dưỡng ẩm sâu!';
      } else if (lower.includes('laptop') || lower.includes('sinh viên')) {
        reply =
        'Với phân khúc laptop học tập và làm việc, các dòng máy mỏng nhẹ pin trâu có cấu hình Core i5/Ryzen 5 và 16GB RAM đang được trợ giá sinh viên giảm đến 25% kèm quà tặng!';
      } else if (lower.includes('freeship') || lower.includes('ship')) {
        reply =
        'Mẹo Freeship hôm nay: Đơn từ $20 được giảm ngay $5 và đơn từ $50 được miễn phí vận chuyển 100%! Nhớ lưu mã ở mục Shopee Voucher trước khi thanh toán nhé!';
      } else {
        reply = `Dạ em đã ghi nhận nhu cầu "${text}" của bạn! Bạn có thể xem ngay các deal giảm giá sốc đang có trên trang chủ Shopee!`;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: 'Vừa xong'
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarCircle}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Shopee AI Assistant</Text>
                <Text style={styles.headerSubtitle}>Trợ lý thông minh hỗ trợ 24/7</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}>
            
            {messages.map((item) =>
            <View
              key={item.id}
              style={[
              styles.msgRow,
              item.sender === 'user' ? styles.msgRowUser : styles.msgRowAi]
              }>
              
                {item.sender === 'ai' &&
              <View style={styles.botIcon}>
                    <Ionicons name="sparkles" size={14} color={SHOPEE_COLORS.primary} />
                  </View>
              }
                <View
                style={[
                styles.msgBubble,
                item.sender === 'user' ? styles.msgBubbleUser : styles.msgBubbleAi]
                }>
                
                  <Text
                  style={[
                  styles.msgText,
                  item.sender === 'user' ? styles.msgTextUser : styles.msgTextAi]
                  }>
                  
                    {item.text}
                  </Text>
                  <Text
                  style={[
                  styles.msgTime,
                  item.sender === 'user' ? styles.msgTimeUser : styles.msgTimeAi]
                  }>
                  
                    {item.time}
                  </Text>
                </View>
              </View>
            )}

            {isTyping &&
            <View style={[styles.msgRow, styles.msgRowAi]}>
                <View style={styles.botIcon}>
                  <ActivityIndicator size="small" color={SHOPEE_COLORS.primary} />
                </View>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingText}>Shopee AI đang phản hồi...</Text>
                </View>
              </View>
            }
          </ScrollView>

          {/* Quick Prompts */}
          <View style={styles.promptsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
              {QUICK_PROMPTS.map((prompt, idx) =>
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSend(prompt)}
                activeOpacity={0.7}>
                
                  <Text style={styles.promptChipText}>{prompt}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Hỏi Shopee AI về sản phẩm, khuyến mãi..."
              placeholderTextColor="#999999"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send" />
            
            <TouchableOpacity
              style={[
              styles.sendBtn,
              !input.trim() && styles.sendBtnDisabled]
              }
              onPress={() => handleSend()}
              disabled={!input.trim()}
              activeOpacity={0.8}>
              
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>);

};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: '80%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SHOPEE_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SHOPEE_COLORS.text
  },
  headerSubtitle: {
    fontSize: 11,
    color: SHOPEE_COLORS.textSecondary
  },
  closeBtn: {
    padding: 6
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 16
  },
  chatContent: {
    paddingVertical: 16,
    gap: 12
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8
  },
  msgRowAi: {
    justifyContent: 'flex-start'
  },
  msgRowUser: {
    justifyContent: 'flex-end'
  },
  botIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE9E2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  msgBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16
  },
  msgBubbleAi: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4
  },
  msgBubbleUser: {
    backgroundColor: SHOPEE_COLORS.primary,
    borderBottomRightRadius: 4
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18
  },
  msgTextAi: {
    color: SHOPEE_COLORS.text
  },
  msgTextUser: {
    color: '#FFFFFF'
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4
  },
  msgTimeAi: {
    color: '#9CA3AF',
    alignSelf: 'flex-start'
  },
  msgTimeUser: {
    color: '#FFE2D9',
    alignSelf: 'flex-end'
  },
  typingBubble: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16
  },
  typingText: {
    fontSize: 12,
    color: SHOPEE_COLORS.textSecondary,
    fontStyle: 'italic'
  },
  promptsContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0'
  },
  promptsScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  promptChip: {
    backgroundColor: '#FFF5F2',
    borderWidth: 1,
    borderColor: '#FFD3C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  promptChipText: {
    color: SHOPEE_COLORS.primary,
    fontSize: 11,
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: SHOPEE_COLORS.text
  },
  sendBtn: {
    backgroundColor: SHOPEE_COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: '#CCCCCC'
  }
});