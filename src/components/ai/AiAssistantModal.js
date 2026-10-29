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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

const QUICK_PROMPTS = [
  'Gợi ý quà sinh nhật dưới $50',
  'Laptop giá rẻ cho sinh viên',
  'Sản phẩm chăm sóc da bán chạy',
  'Nước hoa nam thanh lịch',
];

export const AiAssistantModal = ({ visible, onClose, onSearchProduct }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Mình là Trợ lý AI (Gemini 3.5 Flash Lite). Bạn cần tư vấn tìm kiếm món đồ nào hôm nay?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(!API_KEY);

  const activeKey = customKey.trim() || API_KEY;

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!activeKey) {
      Alert.alert(
        'Yêu cầu API Key',
        'Vui lòng nhập Gemini API Key hoặc cài đặt EXPO_PUBLIC_GEMINI_API_KEY để sử dụng trợ lý AI.',
        [{ text: 'Đồng ý', onPress: () => setShowKeyInput(true) }]
      );
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Build conversation history for Gemini API
      const contents = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      // If only one user message, send direct prompt
      const payloadContents =
        contents.length > 0
          ? contents
          : [{ role: 'user', parts: [{ text }] }];

      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${activeKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Bạn là Trợ lý AI Mua sắm thông minh cho ứng dụng E-Commerce. Hãy tư vấn nhiệt tình, gợi ý sản phẩm phù hợp ngân sách, trả lời ngắn gọn, thân thiện và súc tích bằng tiếng Việt.',
              },
            ],
          },
          contents: payloadContents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data?.error?.message || `Lỗi API (${response.status})`;
        throw new Error(errMsg);
      }

      const replyText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Xin lỗi, hiện tại mình chưa thể xử lý yêu cầu này.';

      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText.trim(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ Lỗi kết nối Gemini API: ${err.message}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.title}>Trợ lý AI Mua sắm</Text>
                <Text style={styles.subtitle}>Powered by Gemini 3.5 Flash Lite</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => setShowKeyInput((v) => !v)}
                style={styles.keyToggleBtn}
              >
                <Ionicons name="key-outline" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {showKeyInput && (
            <View style={styles.keyInputContainer}>
              <Text style={styles.keyInputLabel}>Gemini API Key:</Text>
              <View style={styles.keyInputRow}>
                <TextInput
                  style={styles.keyInput}
                  placeholder="Dán Gemini API Key tại đây..."
                  placeholderTextColor="#94A3B8"
                  value={customKey}
                  onChangeText={setCustomKey}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.saveKeyBtn}
                  onPress={() => setShowKeyInput(false)}
                >
                  <Text style={styles.saveKeyBtnText}>Xong</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Chat Messages */}
          <ScrollView
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isAi ? styles.messageRowAi : styles.messageRowUser,
                  ]}
                >
                  {isAi && (
                    <View style={styles.avatar}>
                      <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isAi ? styles.bubbleAi : styles.bubbleUser,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isAi ? styles.messageTextAi : styles.messageTextUser,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              );
            })}

            {loading && (
              <View style={[styles.messageRow, styles.messageRowAi]}>
                <View style={styles.avatar}>
                  <Ionicons name="sparkles" size={14} color={COLORS.primary} />
                </View>
                <View style={[styles.bubble, styles.bubbleAi, styles.loadingBubble]}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.loadingBubbleText}>Gemini đang trả lời...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompts */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.promptScroll}
            contentContainerStyle={styles.promptScrollContent}
          >
            {QUICK_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSend(prompt)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.promptChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập câu hỏi hoặc sản phẩm cần tìm..."
              placeholderTextColor="#94A3B8"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
              editable={!loading}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || loading) && styles.sendBtnDisabled,
              ]}
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  keyToggleBtn: {
    padding: 6,
  },
  closeBtn: {
    padding: 4,
  },
  keyInputContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  keyInputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  keyInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
  },
  saveKeyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveKeyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bubbleAi: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextAi: {
    color: COLORS.text,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingBubbleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  promptScroll: {
    maxHeight: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  promptScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  promptChip: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  promptChipText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
});

