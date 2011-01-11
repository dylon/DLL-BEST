using System;
using CG = System.Collections.Generic;

namespace DllBest {

	public interface ITree<T,N,I>
		where I : ITree<T,N,I> 
		where N : INode<T,N> {

		/// <summary>
		/// Root Node of this Tree </summary>
		N Root { get; set; }

		/// <summary>
		/// Head of the doubly-linked list </summary>
		N Head { get; set; }

		/// <summary>
		/// Tail of the doubly-linked list </summary>
		N Tail { get; set; }

		/// <summary>
		/// Number of elements in this Tree </summary>
		int Elements { get; set; }

		/// <summary>
		/// Height of this Binary Search Tree </summary>
		int Height { get; }

		/// <summary>
		/// Biggest value in this Tree </summary>
		N Biggest { get; }

		/// <summary>
		/// Smallest value in this Tree </summary>
		N Smallest { get; }
		
		/// <summary>
		/// Adds a child Node to the specified parent </summary>
		///
		/// <param name-"parent"> Parent Node </param>
		/// <param name="child"> Child Node </param>
		void Add(N parent, N child);

		/// <summary>
		/// Creates and appends a new Node using the provided value as its value
		/// </summary>
		///
		/// <param name="value">
		/// Value of the Node to insert </param>
		void Insert(T value);
		
		/// <summary>
		/// Removes a Node from this Tree </summary>
		///
		/// <param name="node"> Node to remove </param>
		void Remove(N node);

		/// <summary>
		/// Removes a Node from this Tree </summary>
		///
		/// <param name="value"> Value of the Node to remove </param>
		void Remove(T value);

		/// <summary>
		/// Locates and returns the biggest Node from the given one </summary>
		///
		/// <param name="node">
		/// Root Node of the sub-tree to traverse </param>
		///
		/// <returns>
		/// The biggest Node branching from node </returns>
		N FindBiggest(N node);

		/// <summary>
		/// Locates and returns the smalles Node from the given one </summary>
		///
		/// <param name="node">
		/// Root Node of the sub-tree to traverse </param>
		///
		/// <returns>
		/// The smallest Node branching from node </returns>
		N FindSmallest(N node);

		/// <summary>
		/// Finds the first Node in this Tree with the corresponding value </summary>
		///
		/// <param name="value">
		/// Value of the Node to seek </param>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <returns>
		/// Either a matching Node or null if none can be found </returns>
		N Find(T value, N node);

		/// <summary>
		/// Finds the first Node in this Tree with the corresponding value </summary>
		///
		/// <param name="value">
		/// Value of the Node to seek </param>
		///
		/// <returns>
		/// Either a matching Node or null if none can be found </returns>
		N Find(T value);

		/// <summary>
		/// Returns the value of this Tree at the specified index </summary>
		///
		/// <param name="index">
		/// Index at which to retrieve the value </param>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <returns>
		/// Value of this Tree at index </returns>
		T Get(int index, N node);

		/// <summary>
		/// Returns the value of this Tree at the specified index </summary>
		///
		/// <param name="index">
		/// Index at which to retrieve the value </param>
		///
		/// <returns>
		/// Value of this Tree at index </returns>
		T Get(int index);

		/// <summary>
		/// Recursively traverses this Tree in pre-order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		void PreOrder(N node, CG.List<T> list);

		/// <summary>
		/// Recursively traverses this Tree in pre-order </summary>
		///
		/// <returns>
		/// The values of this Tree in pre-order </returns>
		CG.List<T> PreOrder();
		
		/// <summary>
		/// Recursively traverses this Tree in order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		void InOrder(N node, CG.List<T> list);

		/// <summary>
		/// Recursively traverses this Tree in order </summary>
		///
		/// <returns>
		/// The values of this Tree in order </returns>
		CG.List<T> InOrder();

		/// <summary>
		/// Recursively traverses this Tree in post-order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		void PostOrder(N node, CG.List<T> list);

		/// <summary>
		/// Recursively traverses this Tree in post-order </summary>
		///
		/// <returns>
		/// The values of this Tree in post-order </returns>
		CG.List<T> PostOrder();

		/// <summary>
		/// Returns the range of nodes from this Tree whose values are bounded
		/// by lower and upper </summary>
		///
		/// <param name="lower">
		/// Lower bound of the elements to return </param>
		///
		/// <param name="upper">
		/// Upper bound of the elements to return </param>
		///
		/// <returns>
		/// A list of the bounded elements in this Tree </returns>
		CG.List<T> Range(T lower, T upper);
	}
}

