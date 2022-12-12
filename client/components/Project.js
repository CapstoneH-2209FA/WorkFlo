import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "../styles/Board.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Drawer from "../components/Drawer";
import { fetchLists, updateList, movingList } from "../store/listSlice";
import List from "./List";
import AddList from "./AddList";
import CopyLinkModal from "./CopyLinkModal2";
import {
  fetchProjects,
  fetchSelectedProject,
  fetchWhiteboards,
} from "../store/projectSlice";
import CardModal2 from "./CardModal2";
import WhiteboardModal from "./Whiteboard/WhiteboardModal";
import CreateProjectModal from "./CreateProjectModal";
import {
  fetchCards,
  movingCardLists,
  updateCardIndex,
  updateCards,
} from "../store/cardSlice";
import "../styles/Project.css";
import socket from "../socket";
import { toggleModal } from "../store/uiSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import { flexbox } from "@mui/system";

function Project() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const lists = useSelector((state) => state.lists);
  const projects = useSelector((state) => state.project);
  const cards = useSelector((state) => state.cards);
  const { modalIsOpen } = useSelector((state) => state.ui);
  const { messageList } = useSelector((state) => state.chat);

  const params = useParams();
  const [messageCounter, setMessageCounter] = useState(0);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchSelectedProject(params.projectId));
    dispatch(fetchLists(params.projectId));
    dispatch(fetchCards(params.projectId));

    socket.emit("user-joined", {
      userId: auth.id,
      projectId: +params.projectId,
    });
  }, [params.projectId]);
  //todo
  let num = messageCounter;
  useEffect(() => {
    socket.on("receive_message", () => {
      num += 1;
      setMessageCounter(num);
    });
  }, [socket]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const [aListDrag] = lists.filter(
        (item) => item.listHashId === draggableId
      );

      dispatch(
        movingList({
          listDragId: aListDrag.id,
          startingIndex: source.index,
          finishingIndex: destination.index,
          projectId: params.projectId,
        })
      );
      return;
    }

    const [startingList] = lists.filter(
      (item) => item.listHashId === source.droppableId
    );
    const [finishingList] = lists.filter(
      (item) => item.listHashId === destination.droppableId
    );
    const [aCardDrag] = cards.filter((item) => item.cardHashId === draggableId);

    if (startingList.id === finishingList.id) {
      const newCardIds = startingList.cards.map((item) => item);

      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, aCardDrag);

      const newList = {
        ...startingList,
        cards: newCardIds,
      };

      const index = lists.findIndex((object) => {
        return object.id === newList.id;
      });

      const arrangedList = lists.map((item) => item);

      arrangedList.splice(index, 1, newList);

      const newState = {
        lists: { ...arrangedList },
      };

      const arrayOfObj = Object.keys(newState.lists).map(
        (key) => (newState.lists[key] = newState.lists[key])
      );

      dispatch(
        updateCardIndex({
          cardDragId: aCardDrag.id,
          startingIndex: source.index,
          finishingIndex: destination.index,
          listId: startingList.id,
        })
      );
      dispatch(updateList(arrayOfObj));
      return;
    }
    dispatch(
      movingCardLists({
        startingIndex: source.index,
        finishingIndex: destination.index,
        startingListId: startingList.id,
        finishingListId: finishingList.id,
      })
    );
  };

  return (
    <div className="Project-Container">
      <CardModal2 modalName="card" />
      <WhiteboardModal />
      <CreateProjectModal modalName="createProject" />
      <CopyLinkModal />

      <ToastContainer />
      <div className="Drawer-Title">
        <span className={messageCounter ? "unread" : ""}>
          {messageCounter === 0 ? "" : messageCounter}
        </span>
        <Drawer setMessageCounter={setMessageCounter} />
        <div className="Title">
          <h2>{projects.selectedProject?.title}</h2>
        </div>
      </div>
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided) => (
              <div
                className="Board"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {lists.length &&
                  lists.map((list, index) => {
                    return (
                      <List
                        key={list.id}
                        title={list.title}
                        listid={list.id}
                        listHashId={list.listHashId}
                        index={index}
                      />
                    );
                  })}
                {provided.placeholder}
                <AddList projectid={params.projectId} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Project;
