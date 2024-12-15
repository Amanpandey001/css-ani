'use client';

import { useState, useEffect, useRef } from "react";
import Cardot from "./Cardot";

const PostList = ({ data }) => {
    // Adding a ref to keep track of all card elements
    const cardsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Add class for animation when the card is in view
                        entry.target.classList.add("animate-visible");
                        entry.target.classList.remove("animate-hidden", "animate-blur");
                    } else {
                        // Add class for blur when the card is leaving the view
                        entry.target.classList.add("animate-blur");
                        entry.target.classList.remove("animate-visible");
                    }
                });
            },
            {
                threshold: 0.4, // Trigger when 20% of the card is visible
            }
        );

        // Observe each card
        cardsRef.current.forEach((card) => observer.observe(card));

        // Cleanup on unmount
        return () => {
            cardsRef.current.forEach((card) => observer.unobserve(card));
        };
    }, [data]);

    return (
        <div>
            {data.map((post, index) => (
                <div
                    key={post.id}
                    ref={(el) => (cardsRef.current[index] = el)} // Save each card in the ref
                    className="card animate-hidden" // Start with hidden class
                >
                    <Cardot post={post} />
                </div>
            ))}
        </div>
    );
};

const Cardholder = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    return (
        <div>
            <PostList data={posts} />
        </div>
    );
};

export default Cardholder;
