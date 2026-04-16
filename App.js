import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Pressable, Text, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [enteredTask, setEnteredTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task we are editing

  useEffect(() => {
    const load = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@task_list');
        if (jsonValue != null) setTasks(JSON.parse(jsonValue));
      } catch (e) { console.log(e); }
      finally { setIsLoaded(true); }
    };
    load();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const save = async () => {
        try { await AsyncStorage.setItem('@task_list', JSON.stringify(tasks)); } 
        catch (e) { console.log(e); }
      };
      save();
    }
  }, [tasks, isLoaded]);

  const taskHandler = () => {
    const trimmed = enteredTask.trim();
    if (trimmed.length === 0) return;

    if (editingTaskId) {
      // UPDATE MODE
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === editingTaskId ? { ...task, text: trimmed } : task
        )
      );
      setEditingTaskId(null);
    } else {
      // ADD MODE
      const isDuplicate = tasks.some(t => t.text.toLowerCase() === trimmed.toLowerCase());
      if (isDuplicate) {
        Alert.alert("Duplicate", "Task already exists.");
        return;
      }
      setTasks(current => [...current, { text: trimmed, id: Math.random().toString() }]);
    }
    setEnteredTask('');
  };

  const startEditHandler = (task) => {
    setEnteredTask(task.text);
    setEditingTaskId(task.id);
  };

  const deleteHandler = (id) => {
    if (editingTaskId === id) setEditingTaskId(null); // Cancel edit if deleting
    setTasks(current => current.filter(t => t.id !== id));
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.textInput} 
          onChangeText={setEnteredTask} 
          value={enteredTask}
          onSubmitEditing={taskHandler}
          placeholder={editingTaskId ? "Editing task..." : "New task..."}
        />
        <Pressable onPress={taskHandler} style={[styles.button, editingTaskId && styles.editButton]}>
          <Text style={styles.buttonText}>{editingTaskId ? "SAVE" : "ADD"}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={tasks.length === 0 && styles.emptyScroll}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet. 📝</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskContainer}>
              <Pressable style={styles.taskItem} onPress={() => startEditHandler(task)}>
                <Text style={styles.taskText}>{task.text}</Text>
              </Pressable>
              <Pressable onPress={() => deleteHandler(task.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>X</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, paddingTop: 70, paddingHorizontal: 20, backgroundColor: '#fff' },
  inputContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  textInput: { width: '70%', borderWidth: 1, padding: 12, borderRadius: 10, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 20, borderRadius: 10, justifyContent: 'center' },
  editButton: { backgroundColor: '#FF9500' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  taskContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  taskItem: { flex: 1, padding: 15, backgroundColor: '#f8f8f8', borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#007AFF' },
  deleteBtn: { marginLeft: 10, padding: 10 },
  deleteText: { color: 'red', fontWeight: 'bold' },
  emptyScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontStyle: 'italic' }
});